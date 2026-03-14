import type { Command } from "commander";
import type { InstallMode } from "#adapters/adapter.interface.js";
import inquirer from "inquirer";
import { ConfigManager } from "#lib/ConfigManager.js";
import { reconcileAndInstall } from "#lib/Reconciler.js";
import { ui } from "#ui/terminal-ui.js";
import chalk from "chalk";

export function registerInstallCommand(program: Command): void {
  program
    .command("install")
    .description("Install all skills defined in sandwich.json")
    .option("-c, --config <path>", "path to config file", "sandwich.json")
    .option("--overwrite", "re-install skills even if already present", false)
    .action(async (opts: { config: string; overwrite: boolean }) => {
      const configManager = new ConfigManager(process.cwd());

      let config;
      try {
        config = await configManager.read();
      } catch (err: any) {
        ui.error(err.message);
        process.exitCode = 1;
        return;
      }

      if (config.skills.length === 0) {
        ui.warning("No skills defined in sandwich.json. Add skills with: sandwich skill add <registry> <skill>");
        return;
      }

      const { mode }: { mode: InstallMode } = await inquirer.prompt([{
        type: "list",
        name: "mode",
        message: "How do you want to install skills?",
        choices: [
          { name: `Clone ${chalk.dim("— copy files into your project")}`, value: "clone" },
          { name: `Symlink ${chalk.dim("— link to registry cache, auto-updates")}`, value: "symlink" },
        ],
        default: "clone",
      }]);

      const spinner = ui.spinner(`Installing ${config.skills.length} skill(s)...`);
      spinner.start();

      let report;
      try {
        report = await reconcileAndInstall(config, { overwrite: opts.overwrite, mode });
        spinner.stop();
      } catch (err: any) {
        spinner.fail("Install failed");
        ui.error(err.message);
        process.exitCode = 1;
        return;
      }

      // Print per-skill results
      for (const r of report.results) {
        const envLabel = chalk.dim(`[${r.env}]`);
        if (r.status === "installed") {
          ui.success(`${envLabel} ${r.registry}/${r.name}`);
        } else if (r.status === "skipped") {
          ui.info(`${envLabel} ${r.registry}/${r.name} ${chalk.dim("(already installed)")}`);
        } else {
          ui.error(`${envLabel} ${r.registry}/${r.name}: ${r.error}`);
        }
      }

      ui.summary({
        title: "Install Summary",
        items: [
          { type: "success", count: report.summary.installed, label: "installed" },
          { type: "info", count: report.summary.skipped, label: "skipped" },
          { type: "error", count: report.summary.failed, label: "failed" },
        ],
      });

      if (report.summary.failed > 0) {
        process.exitCode = 1;
      }
    });
}
