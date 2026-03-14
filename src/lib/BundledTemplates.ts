import fsExtra from "fs-extra";
const { pathExists, readdir, stat, copy, ensureDir, readFile, outputFile } = fsExtra;
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import type { WorkflowType } from "./types.js";
import { WORKFLOW_MAP } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// dist/index.js → package root → templates/
// Allow override for testing (vitest runs from src/, not dist/)
const TEMPLATES_DIR = process.env["SANDWICH_TEMPLATES_DIR"] ?? join(__dirname, "..", "templates");

export interface BundledSkill {
  name: string;
  path: string;
}

export interface BundledCommand {
  name: string;
  path: string;
}

export class BundledTemplates {
  static get skillsDir(): string {
    return join(TEMPLATES_DIR, "skills");
  }

  static get commandsDir(): string {
    return join(TEMPLATES_DIR, "commands");
  }

  static async listSkills(workflow?: WorkflowType): Promise<BundledSkill[]> {
    if (!(await pathExists(this.skillsDir))) return [];
    const entries = await readdir(this.skillsDir);
    const skills: BundledSkill[] = [];
    for (const name of entries) {
      const skillPath = join(this.skillsDir, name);
      const s = await stat(skillPath);
      if (!s.isDirectory()) continue;
      if (workflow) {
        const mapping = WORKFLOW_MAP[name];
        if (mapping && mapping !== "both" && mapping !== workflow) continue;
      }
      skills.push({ name, path: skillPath });
    }
    return skills.sort((a, b) => a.name.localeCompare(b.name));
  }

  static async listCommands(workflow?: WorkflowType): Promise<BundledCommand[]> {
    if (!(await pathExists(this.commandsDir))) return [];
    const entries = await readdir(this.commandsDir);
    return entries
      .filter((f) => {
        if (!f.endsWith(".md")) return false;
        if (workflow) {
          const name = f.replace(".md", "");
          const mapping = WORKFLOW_MAP[name];
          if (mapping && mapping !== "both" && mapping !== workflow) return false;
        }
        return true;
      })
      .map((f) => ({ name: f.replace(".md", ""), path: join(this.commandsDir, f) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Copy selected skills to the environment's skillsDir */
  static async installSkills(
    skillNames: string[],
    destSkillsDir: string,
    overwrite = false
  ): Promise<{ name: string; status: "installed" | "skipped" }[]> {
    await ensureDir(destSkillsDir);
    const results = [];
    for (const name of skillNames) {
      const src = join(this.skillsDir, name);
      const dest = join(destSkillsDir, name);
      if (!overwrite && (await pathExists(dest))) {
        results.push({ name, status: "skipped" as const });
        continue;
      }
      await copy(src, dest, { overwrite: true });
      results.push({ name, status: "installed" as const });
    }
    return results;
  }

  /** Copy selected commands to env's commandPath, converting to TOML for Gemini */
  static async installCommands(
    commandNames: string[],
    destCommandPath: string,
    format: "md" | "toml" = "md",
    overwrite = false
  ): Promise<{ name: string; status: "installed" | "skipped" }[]> {
    await ensureDir(destCommandPath);
    const results = [];
    for (const name of commandNames) {
      const src = join(this.commandsDir, `${name}.md`);
      const ext = format === "toml" ? ".toml" : ".md";
      const dest = join(destCommandPath, `${name}${ext}`);

      if (!overwrite && (await pathExists(dest))) {
        results.push({ name, status: "skipped" as const });
        continue;
      }

      if (format === "toml") {
        const md = await readFile(src, "utf-8");
        await outputFile(dest, this.mdToToml(md), "utf-8");
      } else {
        await copy(src, dest, { overwrite: true });
      }
      results.push({ name, status: "installed" as const });
    }
    return results;
  }

  /** Convert a .md command file (with frontmatter) to Gemini .toml format */
  private static mdToToml(mdContent: string): string {
    const { data, content } = matter(mdContent);
    const description = (data.description as string) ?? "";
    const prompt = content.trim();

    // Use a delimiter that doesn't appear in the content
    let delim = "'''";
    if (description.includes(delim) || prompt.includes(delim)) {
      // Fallback: use basic string with escaped quotes
      const escDesc = description.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const escPrompt = prompt.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
      return `description="${escDesc}"\nprompt="${escPrompt}"\n`;
    }
    return `description=${delim}${description}${delim}\nprompt=${delim}${prompt}${delim}\n`;
  }
}
