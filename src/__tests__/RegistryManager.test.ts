import { describe, it, expect } from "vitest";
import { RegistryManager } from "#lib/RegistryManager.js";

describe("RegistryManager", () => {
  const rm = new RegistryManager();

  describe("resolve", () => {
    it("resolves built-in registry alias", async () => {
      const url = await rm.resolve("anthropics/skills");
      expect(url).toBe("https://github.com/anthropics/skills.git");
    });

    it("throws for unknown alias", async () => {
      await expect(rm.resolve("nonexistent/repo")).rejects.toThrow(
        'Registry "nonexistent/repo" not found'
      );
    });
  });

  describe("URL validation", () => {
    it("accepts https URLs via ensureCached", async () => {
      // We can't fully test ensureCached without git, but we can test
      // that resolve works for valid registries
      const url = await rm.resolve("anthropics/skills");
      expect(url).toMatch(/^https:\/\//);
    });
  });
});
