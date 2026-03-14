#!/usr/bin/env node

import { Command } from "commander";
import { createRequire } from "module";
import { ui } from "#ui/terminal-ui.js";
import { registerInitCommand } from "#commands/init.js";
import { registerInstallCommand } from "#commands/install.js";
import { registerSkillCommand } from "#commands/skill.js";
import { registerRegistryCommand } from "#commands/registry.js";
import { registerMemoryCommand } from "#commands/memory.js";
import { registerDocsCommand } from "#commands/docs.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version: string };

async function main() {
  ui.banner();

  const program = new Command();

  program
    .name("sandwich")
    .description("Universal AI skill manager — install skills for Claude Code, Gemini, Cursor, Antigravity and more")
    .version(pkg.version);

  registerInitCommand(program);
  registerInstallCommand(program);
  registerSkillCommand(program);
  registerRegistryCommand(program);
  registerMemoryCommand(program);
  registerDocsCommand(program);

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
