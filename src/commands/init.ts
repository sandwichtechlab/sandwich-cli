import type { Command } from "commander";
import inquirer from "inquirer";
import { join } from "path";
import { ConfigManager } from "#lib/ConfigManager.js";
import { RegistryManager } from "#lib/RegistryManager.js";
import { BundledTemplates } from "#lib/BundledTemplates.js";
import { reconcileAndInstall } from "#lib/Reconciler.js";
import { getAllAdapters, getAdapter } from "#adapters/index.js";
import { BUILT_IN_REGISTRIES, ENVIRONMENT_DEFINITIONS } from "#lib/types.js";
import type { EnvironmentCode, SkillEntry, WorkflowType } from "#lib/types.js";
import type { InstallMode } from "#adapters/adapter.interface.js";
import { ui } from "#ui/terminal-ui.js";
import chalk from "chalk";

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("Initialize sandwich.json and scaffold AI tool directories")
    .option("--yes", "skip prompts, use claude + all bundled defaults", false)
    .action(async (opts: { yes: boolean }) => {
      const projectRoot = process.cwd();
      const configManager = new ConfigManager(projectRoot);

      if (await configManager.exists()) {
        const { overwrite } = opts.yes
          ? { overwrite: false }
          : await inquirer.prompt([{
              type: "confirm",
              name: "overwrite",
              message: "sandwich.json already exists. Re-initialize?",
              default: false,
            }]);
        if (!overwrite) {
          ui.info("Aborted. Existing sandwich.json kept.");
          return;
        }
      }

      // ── Step 1: Select environments ──────────────────────────────────────
      const adapters = getAllAdapters();
      const { environments }: { environments: EnvironmentCode[] } = opts.yes
        ? { environments: ["claude"] }
        : await inquirer.prompt([{
            type: "checkbox",
            name: "environments",
            message: "Which AI tools do you use in this project?",
            choices: adapters.map((a) => ({
              name: `${a.label} ${chalk.dim(`(${a.code})`)}`,
              value: a.code,
              checked: a.code === "claude",
            })),
            validate: (v: string[]) => v.length > 0 ? true : "Select at least one.",
          }]);

      // ── Step 1b: Select workflow ────────────────────────────────────────
      const { workflow }: { workflow: WorkflowType } = opts.yes
        ? { workflow: "sdlc" }
        : await inquirer.prompt([{
            type: "list",
            name: "workflow",
            message: "Which development workflow do you follow?",
            choices: [
              {
                name: `SDLC ${chalk.dim("— Software Development Life Cycle (traditional software)")}`,
                value: "sdlc",
              },
              {
                name: `ADLC ${chalk.dim("— Agentic Development Life Cycle (AI agents, prompts, tools)")}`,
                value: "adlc",
              },
            ],
            default: "sdlc",
          }]);

      // ── Step 2: Scaffold env directories ─────────────────────────────────
      console.log();
      for (const env of environments) {
        const adapter = getAdapter(env);
        const result = await adapter.initEnvironment(projectRoot);
        const def = ENVIRONMENT_DEFINITIONS[env];
        if (result.alreadyExisted) {
          ui.info(`${chalk.cyan(adapter.label)}: ${chalk.dim(def.contextFileName)} already exists — skipped`);
        } else {
          ui.success(`${chalk.cyan(adapter.label)}: created ${chalk.bold(def.contextFileName)} + ${chalk.dim(def.commandPath + "/")}`);
          if (def.skillsDir) {
            ui.text(`  ${chalk.dim("└─")} ${chalk.dim(def.skillsDir + "/")}`);
          }
        }
      }

      // ── Step 3: Bundled defaults option ──────────────────────────────────
      const bundledSkills = await BundledTemplates.listSkills(workflow);
      const bundledCommands = await BundledTemplates.listCommands(workflow);
      const hasBundled = bundledSkills.length > 0 || bundledCommands.length > 0;

      let selectedBundledSkills: string[] = [];
      let selectedBundledCommands: string[] = [];

      if (hasBundled) {
        const { useBundled } = opts.yes
          ? { useBundled: true }
          : await inquirer.prompt([{
              type: "confirm",
              name: "useBundled",
              message: `\nInstall bundled defaults? ${chalk.dim(`(${bundledSkills.length} skills, ${bundledCommands.length} commands — no internet needed)`)}`,
              default: true,
            }]);

        if (useBundled) {
          if (bundledSkills.length > 0 && !opts.yes) {
            const { skills } = await inquirer.prompt([{
              type: "checkbox",
              name: "skills",
              message: "Select bundled skills to install:",
              choices: bundledSkills.map((s) => ({ name: s.name, value: s.name, checked: true })),
              pageSize: 20,
            }]);
            selectedBundledSkills = skills;
          } else if (opts.yes) {
            selectedBundledSkills = bundledSkills.map((s) => s.name);
          }

          if (bundledCommands.length > 0 && !opts.yes) {
            const { commands } = await inquirer.prompt([{
              type: "checkbox",
              name: "commands",
              message: "Select bundled commands to install:",
              choices: bundledCommands.map((c) => ({ name: c.name, value: c.name, checked: true })),
              pageSize: 20,
            }]);
            selectedBundledCommands = commands;
          } else if (opts.yes) {
            selectedBundledCommands = bundledCommands.map((c) => c.name);
          }
        }
      }

      // ── Step 4: Install bundled skills + commands per environment ─────────
      if (selectedBundledSkills.length > 0 || selectedBundledCommands.length > 0) {
        console.log();
        ui.text(chalk.bold("Installing bundled defaults..."));

        for (const env of environments) {
          const def = ENVIRONMENT_DEFINITIONS[env];

          // Skills (only for envs that have a skillsDir)
          if (selectedBundledSkills.length > 0 && def.skillsDir) {
            const destSkills = join(projectRoot, def.skillsDir);
            const results = await BundledTemplates.installSkills(
              selectedBundledSkills, destSkills
            );
            const installed = results.filter((r) => r.status === "installed").length;
            const skipped = results.filter((r) => r.status === "skipped").length;
            ui.success(
              `${chalk.cyan(def.label ?? env)} skills: ${chalk.green(String(installed))} installed` +
              (skipped > 0 ? `, ${chalk.dim(String(skipped) + " skipped")}` : "")
            );
          }

          // Commands
          if (selectedBundledCommands.length > 0) {
            const destCommands = join(projectRoot, def.commandPath);
            const fmt = def.commandFormat ?? "md";
            const results = await BundledTemplates.installCommands(
              selectedBundledCommands, destCommands, fmt
            );
            const installed = results.filter((r) => r.status === "installed").length;
            const skipped = results.filter((r) => r.status === "skipped").length;
            const ext = fmt === "toml" ? ".toml" : ".md";
            ui.success(
              `${chalk.cyan(def.label ?? env)} commands (${chalk.dim(ext)}): ${chalk.green(String(installed))} installed` +
              (skipped > 0 ? `, ${chalk.dim(String(skipped) + " skipped")}` : "")
            );
          }
        }
      }

      // ── Step 5: Optionally install registry skills (multi-registry) ─────────
      const registrySkills: SkillEntry[] = [];

      const { addRegistrySkills } = opts.yes
        ? { addRegistrySkills: false }
        : await inquirer.prompt([{
            type: "confirm",
            name: "addRegistrySkills",
            message: "\nInstall skills from git registries?",
            default: false,
          }]);

      if (addRegistrySkills) {
        // 1. Pick one or more registries
        const { selectedRegistries }: { selectedRegistries: string[] } =
          await inquirer.prompt([{
            type: "checkbox",
            name: "selectedRegistries",
            message: "Choose registries (space to select, enter to confirm):",
            choices: Object.keys(BUILT_IN_REGISTRIES).map((alias) => ({
              name: alias,
              value: alias,
            })),
            pageSize: 20,
            validate: (v: string[]) => v.length > 0 ? true : "Select at least one registry.",
          }]);

        // 2. For each selected registry, fetch + let user pick skills
        const registryManager = new RegistryManager();
        const { readdirSync, statSync } = await import("fs");

        for (const registry of selectedRegistries) {
          const spinner = ui.spinner(`Fetching ${chalk.cyan(registry)}...`);
          spinner.start();
          let cacheDir = "";
          try {
            cacheDir = await registryManager.ensureCached(registry);
            spinner.succeed(`Fetched ${chalk.cyan(registry)}`);
          } catch (err: any) {
            spinner.fail(`${registry}: ${err.message}`);
            continue;
          }

          const skillsRoot = join(cacheDir, "skills");
          let available: string[] = [];
          try {
            available = readdirSync(skillsRoot).filter((f) =>
              statSync(join(skillsRoot, f)).isDirectory()
            );
          } catch {
            ui.warning(`Could not list skills in ${registry}.`);
            continue;
          }

          if (available.length === 0) {
            ui.warning(`No skills found in ${registry}.`);
            continue;
          }

          const { selected }: { selected: string[] } = await inquirer.prompt([{
            type: "checkbox",
            name: "selected",
            message: `Skills from ${chalk.cyan(registry)}:`,
            choices: available.map((s) => ({ name: s, value: s })),
            pageSize: 20,
          }]);

          for (const name of selected) registrySkills.push({ registry, name });
        }
      }

      // ── Step 6: Write sandwich.json ───────────────────────────────────────
      const config = await configManager.create(environments, registrySkills, [], workflow);
      console.log();
      ui.success(`Created ${chalk.bold("sandwich.json")}`);
      ui.info(`Workflow     : ${chalk.cyan(workflow.toUpperCase())}`);
      ui.info(`Environments : ${chalk.cyan(environments.join(", "))}`);
      ui.info(`Bundled skills : ${chalk.cyan(String(selectedBundledSkills.length))}`);
      ui.info(`Bundled commands: ${chalk.cyan(String(selectedBundledCommands.length))}`);

      if (registrySkills.length === 0) {
        ui.info(`\nAdd registry skills: ${chalk.dim("sandwich skill add <registry> <skill>")}`);
        return;
      }

      // ── Step 7: Install registry skills ──────────────────────────────────
      const { installMode }: { installMode: InstallMode } = opts.yes
        ? { installMode: "clone" }
        : await inquirer.prompt([{
            type: "list",
            name: "installMode",
            message: "How do you want to install registry skills?",
            choices: [
              { name: `Clone ${chalk.dim("— copy files into your project")}`, value: "clone" },
              { name: `Symlink ${chalk.dim("— link to registry cache, auto-updates")}`, value: "symlink" },
            ],
            default: "clone",
          }]);

      const spinner = ui.spinner(`Installing ${registrySkills.length} registry skill(s)...`);
      spinner.start();
      try {
        const report = await reconcileAndInstall(config, { overwrite: true, mode: installMode }, projectRoot);
        spinner.stop();
        ui.summary({
          title: "Registry Install Summary",
          items: [
            { type: "success", count: report.summary.installed, label: "installed" },
            { type: "info",    count: report.summary.skipped,   label: "skipped" },
            { type: "error",   count: report.summary.failed,    label: "failed" },
          ],
        });
        if (report.summary.failed > 0) process.exitCode = 1;
      } catch (err: any) {
        spinner.fail("Install failed");
        ui.error(err.message);
        process.exitCode = 1;
      }
    });
}
