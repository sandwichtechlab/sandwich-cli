import type { Command } from "commander";
import chalk from "chalk";
import { storeKnowledge, searchKnowledge, updateKnowledge, closeDb } from "#lib/memory/index.js";
import { ui } from "#ui/terminal-ui.js";

export function registerMemoryCommand(program: Command): void {
  const memory = program
    .command("memory")
    .description("Manage knowledge memory (search and store across sessions)");

  memory
    .command("store")
    .description("Store a knowledge item")
    .requiredOption("-t, --title <title>", "Title (max 100 chars)")
    .requiredOption("-c, --content <content>", "Content (max 5000 chars)")
    .option("--tags <tags>", 'Comma-separated tags, e.g. "api,backend"')
    .option("-s, --scope <scope>", "Scope: global | project:<name>", "global")
    .action((opts: { title: string; content: string; tags?: string; scope: string }) => {
      try {
        const result = storeKnowledge({
          title: opts.title,
          content: opts.content,
          tags: opts.tags ? opts.tags.split(",").map((t) => t.trim()) : [],
          scope: opts.scope,
        });
        console.log(JSON.stringify(result, null, 2));
      } catch (err: any) {
        ui.error(err.message);
        process.exitCode = 1;
      } finally {
        closeDb();
      }
    });

  memory
    .command("search")
    .description("Search knowledge items")
    .requiredOption("-q, --query <query>", "Search query (min 3 chars)")
    .option("--tags <tags>", "Filter by comma-separated tags")
    .option("-s, --scope <scope>", "Filter by scope")
    .option("-l, --limit <n>", "Max results (default: 5)", "5")
    .action((opts: { query: string; tags?: string; scope?: string; limit: string }) => {
      try {
        const result = searchKnowledge({
          query: opts.query,
          scope: opts.scope,
          tags: opts.tags ? opts.tags.split(",").map((t) => t.trim()) : undefined,
          limit: parseInt(opts.limit, 10),
        });

        if (result.results.length === 0) {
          ui.warning(`No results for: "${opts.query}"`);
          return;
        }

        ui.text(chalk.bold(`\n${result.results.length} result(s) for "${opts.query}":\n`));
        for (const item of result.results) {
          ui.text(`${chalk.cyan("●")} ${chalk.bold(item.title)} ${chalk.dim(`[${item.scope}]`)}`);
          ui.text(`  ${chalk.dim("id:")} ${item.id}`);
          if (item.tags.length > 0) {
            ui.text(`  ${chalk.dim("tags:")} ${item.tags.map((t) => chalk.yellow(t)).join(", ")}`);
          }
          ui.text(`  ${item.content.slice(0, 200)}${item.content.length > 200 ? "…" : ""}`);
          ui.text("");
        }
      } catch (err: any) {
        ui.error(err.message);
        process.exitCode = 1;
      } finally {
        closeDb();
      }
    });

  memory
    .command("update")
    .description("Update a knowledge item by ID")
    .requiredOption("--id <id>", "ID of the item to update")
    .option("-t, --title <title>", "New title")
    .option("-c, --content <content>", "New content")
    .option("--tags <tags>", "New comma-separated tags")
    .option("-s, --scope <scope>", "New scope")
    .action((opts: { id: string; title?: string; content?: string; tags?: string; scope?: string }) => {
      try {
        const result = updateKnowledge({
          id: opts.id,
          title: opts.title,
          content: opts.content,
          tags: opts.tags ? opts.tags.split(",").map((t) => t.trim()) : undefined,
          scope: opts.scope,
        });
        console.log(JSON.stringify(result, null, 2));
      } catch (err: any) {
        ui.error(err.message);
        process.exitCode = 1;
      } finally {
        closeDb();
      }
    });
}
