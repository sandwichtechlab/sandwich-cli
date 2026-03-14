import { describe, it, expect, beforeAll } from "vitest";
import { join } from "path";
import { readdirSync, statSync } from "fs";
import { WORKFLOW_MAP } from "#lib/types.js";

// Point BundledTemplates at the real templates/ directory
process.env["SANDWICH_TEMPLATES_DIR"] = join(process.cwd(), "templates");

// Import AFTER setting env var
const { BundledTemplates } = await import("#lib/BundledTemplates.js");

const TEMPLATES_DIR = join(process.cwd(), "templates");
const skillsDir = join(TEMPLATES_DIR, "skills");
const commandsDir = join(TEMPLATES_DIR, "commands");

describe("BundledTemplates", () => {
  describe("listSkills", () => {
    it("lists all skills without filter", async () => {
      const skills = await BundledTemplates.listSkills();
      expect(skills.length).toBeGreaterThan(0);
      const names = skills.map((s) => s.name);
      expect(names).toContain("brainstorming");
      expect(names).toContain("debug");
    });

    it("filters ADLC-only skills for sdlc workflow", async () => {
      const skills = await BundledTemplates.listSkills("sdlc");
      const names = skills.map((s) => s.name);
      expect(names).not.toContain("agent-eval");
      expect(names).not.toContain("agent-observe");
      expect(names).not.toContain("prompt-craft");
      expect(names).toContain("brainstorming");
      expect(names).toContain("debug");
    });

    it("includes ADLC-only skills for adlc workflow", async () => {
      const skills = await BundledTemplates.listSkills("adlc");
      const names = skills.map((s) => s.name);
      expect(names).toContain("agent-eval");
      expect(names).toContain("agent-observe");
      expect(names).toContain("prompt-craft");
      expect(names).toContain("brainstorming");
    });

    it("returns sorted results", async () => {
      const skills = await BundledTemplates.listSkills();
      const names = skills.map((s) => s.name);
      const sorted = [...names].sort();
      expect(names).toEqual(sorted);
    });
  });

  describe("listCommands", () => {
    it("lists all commands without filter", async () => {
      const commands = await BundledTemplates.listCommands();
      expect(commands.length).toBeGreaterThan(0);
      const names = commands.map((c) => c.name);
      expect(names).toContain("plan");
      expect(names).toContain("test");
    });

    it("filters ADLC-only commands for sdlc workflow", async () => {
      const commands = await BundledTemplates.listCommands("sdlc");
      const names = commands.map((c) => c.name);
      expect(names).not.toContain("craft");
      expect(names).not.toContain("eval");
      expect(names).not.toContain("observe");
      expect(names).toContain("plan");
      expect(names).toContain("deploy");
    });

    it("includes ADLC-only commands for adlc workflow", async () => {
      const commands = await BundledTemplates.listCommands("adlc");
      const names = commands.map((c) => c.name);
      expect(names).toContain("craft");
      expect(names).toContain("eval");
      expect(names).toContain("observe");
      expect(names).toContain("plan");
    });
  });

  describe("installSkills", () => {
    it("installs skills to destination", async () => {
      const { mkdtempSync, rmSync, existsSync } = await import("fs");
      const { tmpdir } = await import("os");

      const dest = mkdtempSync(join(tmpdir(), "sandwich-skills-test-"));
      try {
        const results = await BundledTemplates.installSkills(["brainstorming"], dest);
        expect(results).toHaveLength(1);
        expect(results[0].status).toBe("installed");
        expect(existsSync(join(dest, "brainstorming", "SKILL.md"))).toBe(true);
      } finally {
        rmSync(dest, { recursive: true, force: true });
      }
    });

    it("skips already installed skills", async () => {
      const { mkdtempSync, rmSync, mkdirSync } = await import("fs");
      const { tmpdir } = await import("os");

      const dest = mkdtempSync(join(tmpdir(), "sandwich-skills-test-"));
      mkdirSync(join(dest, "brainstorming"), { recursive: true });
      try {
        const results = await BundledTemplates.installSkills(["brainstorming"], dest, false);
        expect(results[0].status).toBe("skipped");
      } finally {
        rmSync(dest, { recursive: true, force: true });
      }
    });
  });

  describe("WORKFLOW_MAP consistency", () => {
    it("every skill directory has a WORKFLOW_MAP entry", () => {
      const skillDirs = readdirSync(skillsDir).filter((n) =>
        statSync(join(skillsDir, n)).isDirectory()
      );
      for (const name of skillDirs) {
        expect(WORKFLOW_MAP[name], `Missing WORKFLOW_MAP entry for skill "${name}"`).toBeDefined();
      }
    });

    it("every command file has a WORKFLOW_MAP entry", () => {
      const cmdFiles = readdirSync(commandsDir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(".md", ""));
      for (const name of cmdFiles) {
        expect(WORKFLOW_MAP[name], `Missing WORKFLOW_MAP entry for command "${name}"`).toBeDefined();
      }
    });
  });
});
