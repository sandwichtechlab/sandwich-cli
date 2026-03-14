import { describe, it, expect } from "vitest";
import { WORKFLOW_MAP, ENVIRONMENT_DEFINITIONS, BUILT_IN_REGISTRIES } from "#lib/types.js";

describe("types", () => {
  describe("WORKFLOW_MAP", () => {
    it("maps brainstorming to both", () => {
      expect(WORKFLOW_MAP["brainstorming"]).toBe("both");
    });

    it("maps ADLC-only skills correctly", () => {
      expect(WORKFLOW_MAP["agent-eval"]).toBe("adlc");
      expect(WORKFLOW_MAP["agent-observe"]).toBe("adlc");
      expect(WORKFLOW_MAP["prompt-craft"]).toBe("adlc");
    });

    it("maps ADLC-only commands correctly", () => {
      expect(WORKFLOW_MAP["craft"]).toBe("adlc");
      expect(WORKFLOW_MAP["eval"]).toBe("adlc");
      expect(WORKFLOW_MAP["observe"]).toBe("adlc");
    });

    it("maps shared commands to both", () => {
      expect(WORKFLOW_MAP["plan"]).toBe("both");
      expect(WORKFLOW_MAP["design"]).toBe("both");
      expect(WORKFLOW_MAP["execute"]).toBe("both");
      expect(WORKFLOW_MAP["test"]).toBe("both");
      expect(WORKFLOW_MAP["deploy"]).toBe("both");
    });
  });

  describe("ENVIRONMENT_DEFINITIONS", () => {
    it("claude has skillsDir", () => {
      expect(ENVIRONMENT_DEFINITIONS.claude.skillsDir).toBe(".claude/skills");
    });

    it("gemini has toml command format", () => {
      expect(ENVIRONMENT_DEFINITIONS.gemini.commandFormat).toBe("toml");
    });

    it("all envs have required fields", () => {
      for (const [code, def] of Object.entries(ENVIRONMENT_DEFINITIONS)) {
        expect(def.code).toBe(code);
        expect(def.label).toBeTruthy();
        expect(def.contextFileName).toBeTruthy();
        expect(def.commandPath).toBeTruthy();
      }
    });
  });

  describe("BUILT_IN_REGISTRIES", () => {
    it("has anthropics/skills", () => {
      expect(BUILT_IN_REGISTRIES["anthropics/skills"]).toBe(
        "https://github.com/anthropics/skills.git"
      );
    });

    it("all URLs are valid git URLs", () => {
      for (const [alias, url] of Object.entries(BUILT_IN_REGISTRIES)) {
        expect(url, `Invalid URL for ${alias}`).toMatch(/^https:\/\//);
      }
    });
  });
});
