import type { Command } from "commander";
import chalk from "chalk";
import { GlobalConfig } from "#lib/GlobalConfig.js";
import { ConfigManager } from "#lib/ConfigManager.js";
import { BUILT_IN_REGISTRIES } from "#lib/types.js";
import { ui } from "#ui/terminal-ui.js";

export function registerRegistryCommand(program: Command): void {
  const registry = program
    .command("registry")
    .description("Manage skill registries");

  registry
    .command("add <alias> <url>")
    .description(
      'Add a global registry (e.g., sandwich registry add my-org/skills "https://github.com/my-org/skills.git")'
    )
    .option("--project", "save to sandwich.json instead of global config")
    .action(async (alias: string, url: string, opts: { project?: boolean }) => {
      try {
        if (opts.project) {
          const configManager = new ConfigManager();
          await configManager.addRegistry({ alias, url });
          ui.success(`Added registry ${chalk.cyan(alias)} to sandwich.json`);
        } else {
          await GlobalConfig.addRegistry(alias, url);
          ui.success(`Added registry ${chalk.cyan(alias)} globally (~/.sandwich/registries.json)`);
        }
      } catch (err: any) {
        ui.error(err.message);
        process.exitCode = 1;
      }
    });

  registry
    .command("remove <alias>")
    .description("Remove a registry")
    .option("--project", "remove from sandwich.json instead of global config")
    .action(async (alias: string, opts: { project?: boolean }) => {
      if (alias in BUILT_IN_REGISTRIES) {
        ui.error(`Cannot remove built-in registry "${alias}".`);
        process.exitCode = 1;
        return;
      }
      try {
        if (opts.project) {
          const configManager = new ConfigManager();
          const removed = await configManager.removeRegistry(alias);
          removed
            ? ui.success(`Removed registry ${chalk.cyan(alias)} from sandwich.json`)
            : ui.warning(`Registry "${alias}" not found in sandwich.json`);
        } else {
          const removed = await GlobalConfig.removeRegistry(alias);
          removed
            ? ui.success(`Removed registry ${chalk.cyan(alias)} from global config`)
            : ui.warning(`Registry "${alias}" not found in global config`);
        }
      } catch (err: any) {
        ui.error(err.message);
        process.exitCode = 1;
      }
    });

  registry
    .command("list")
    .description("List all available registries")
    .action(async () => {
      try {
        const all = await GlobalConfig.getRegistries();
        const rows = Object.entries(all).map(([alias, url]) => [
          alias,
          alias in BUILT_IN_REGISTRIES ? chalk.dim("built-in") : chalk.yellow("custom"),
          url,
        ]);

        ui.table({
          headers: ["Alias", "Type", "URL"],
          rows,
          columnStyles: [chalk.cyan, (s) => s, chalk.dim],
        });
      } catch (err: any) {
        ui.error(err.message);
        process.exitCode = 1;
      }
    });
}
