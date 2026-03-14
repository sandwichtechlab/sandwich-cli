import type { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import { ConfigManager } from "#lib/ConfigManager.js";
import { RegistryManager } from "#lib/RegistryManager.js";
import { SkillManager } from "#lib/SkillManager.js";
import { ui } from "#ui/terminal-ui.js";
import type { EnvironmentCode } from "#lib/types.js";

export function registerSkillCommand(program: Command): void {
  const skill = program
    .command("skill")
    .description("Manage skills");

  skill
    .command("add <registry> <name>")
    .description(
      "Install a skill from a registry (e.g., sandwich skill add anthropics/skills dev-lifecycle)"
    )
    .option(
      "-e, --env <envs>",
      "comma-separated environments to install for (default: all configured)"
    )
    .option("--overwrite", "overwrite if already installed", false)
    .action(async (registry: string, name: string, opts: { env?: string; overwrite: boolean }) => {
      const envs = opts.env
        ? (opts.env.split(",").map((e) => e.trim()) as EnvironmentCode[])
        : undefined;

      const { mode } = await inquirer.prompt([{
        type: "list",
        name: "mode",
        message: "How do you want to install the skill?",
        choices: [
          { name: `Clone ${chalk.dim("— copy files into your project")}`, value: "clone" },
          { name: `Symlink ${chalk.dim("— link to registry cache, auto-updates")}`, value: "symlink" },
        ],
        default: "clone",
      }]);

      const configManager = new ConfigManager();
      const registryManager = new RegistryManager();
      const manager = new SkillManager(configManager, registryManager);

      const spinner = ui.spinner(`Fetching ${registry}/${name}...`);
      spinner.start();

      try {
        await manager.addSkill(registry, name, envs, mode);
        const modeLabel = mode === "symlink" ? chalk.dim(" (symlinked)") : "";
        spinner.succeed(`Installed: ${chalk.cyan(registry + "/" + name)}${modeLabel}`);
      } catch (err: any) {
        spinner.fail(`Failed to install ${name}`);
        ui.error(err.message);
        process.exitCode = 1;
      }
    });

  skill
    .command("remove <registry> <name>")
    .description("Remove a skill (e.g., sandwich skill remove anthropics/skills dev-lifecycle)")
    .action(async (registry: string, name: string) => {
      const configManager = new ConfigManager();
      const registryManager = new RegistryManager();
      const manager = new SkillManager(configManager, registryManager);

      try {
        const removed = await manager.removeSkill(registry, name);
        if (removed) {
          ui.success(`Removed: ${chalk.cyan(registry + "/" + name)}`);
        } else {
          ui.warning(`Skill "${name}" not found in sandwich.json`);
        }
      } catch (err: any) {
        ui.error(err.message);
        process.exitCode = 1;
      }
    });

  skill
    .command("list")
    .description("List all installed skills")
    .action(async () => {
      const configManager = new ConfigManager();
      const registryManager = new RegistryManager();
      const manager = new SkillManager(configManager, registryManager);

      try {
        const skills = await manager.listSkills();

        if (skills.length === 0) {
          ui.warning("No skills installed.");
          ui.info("Add a skill: sandwich skill add <registry> <name>");
          return;
        }

        ui.table({
          headers: ["Skill", "Registry", "Environments"],
          rows: skills.map((s) => [s.name, s.registry, s.environments.join(", ")]),
          columnStyles: [chalk.cyan, chalk.dim, chalk.green],
        });

        ui.text(`Total: ${skills.length} skill(s)`, { breakline: true });
      } catch (err: any) {
        ui.error(err.message);
        process.exitCode = 1;
      }
    });

  skill
    .command("update <registry> <name>")
    .description("Pull latest version of a skill from registry")
    .action(async (registry: string, name: string) => {
      const { mode } = await inquirer.prompt([{
        type: "list",
        name: "mode",
        message: "How do you want to install the updated skill?",
        choices: [
          { name: `Clone ${chalk.dim("— copy files into your project")}`, value: "clone" },
          { name: `Symlink ${chalk.dim("— link to registry cache, auto-updates")}`, value: "symlink" },
        ],
        default: "clone",
      }]);

      const configManager = new ConfigManager();
      const registryManager = new RegistryManager();
      const manager = new SkillManager(configManager, registryManager);

      const spinner = ui.spinner(`Updating ${registry}/${name}...`);
      spinner.start();

      try {
        await manager.updateSkill(registry, name, mode);
        spinner.succeed(`Updated: ${chalk.cyan(registry + "/" + name)}`);
      } catch (err: any) {
        spinner.fail(`Failed to update ${name}`);
        ui.error(err.message);
        process.exitCode = 1;
      }
    });
}
