import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { storeKnowledge, searchKnowledge, updateKnowledge, deleteKnowledge } from "#lib/memory/index.js";
import { closeDb, getDb } from "#lib/memory/db.js";
import { mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

let tmpDir: string;
let dbPath: string;

describe("memory", () => {
  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "sandwich-memory-test-"));
    dbPath = join(tmpDir, "test.db");
    // Initialize db at test path
    getDb(dbPath);
  });

  afterEach(() => {
    closeDb();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("storeKnowledge", () => {
    it("stores and returns id", () => {
      const result = storeKnowledge({
        title: "Test pattern",
        content: "Use vitest for testing",
        tags: ["testing"],
        scope: "global",
      });
      expect(result.success).toBe(true);
      expect(result.id).toBeTruthy();
    });

    it("throws on empty title", () => {
      expect(() =>
        storeKnowledge({ title: "", content: "content", tags: [], scope: "global" })
      ).toThrow("Title is required");
    });

    it("throws on empty content", () => {
      expect(() =>
        storeKnowledge({ title: "title", content: "", tags: [], scope: "global" })
      ).toThrow("Content is required");
    });

    it("throws on title > 100 chars", () => {
      expect(() =>
        storeKnowledge({ title: "a".repeat(101), content: "content", tags: [], scope: "global" })
      ).toThrow("Title max 100 chars");
    });

    it("throws on content > 5000 chars", () => {
      expect(() =>
        storeKnowledge({ title: "title", content: "a".repeat(5001), tags: [], scope: "global" })
      ).toThrow("Content max 5000 chars");
    });
  });

  describe("searchKnowledge", () => {
    it("finds stored knowledge", () => {
      storeKnowledge({
        title: "Vitest patterns",
        content: "Use describe and it blocks",
        tags: ["testing"],
        scope: "global",
      });
      const result = searchKnowledge({ query: "vitest", scope: "global" });
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].title).toBe("Vitest patterns");
    });

    it("returns empty for no match", () => {
      const result = searchKnowledge({ query: "nonexistent-thing-xyz", scope: "global" });
      expect(result.results).toHaveLength(0);
    });

    it("throws on short query", () => {
      expect(() => searchKnowledge({ query: "ab" })).toThrow("at least 3 characters");
    });
  });

  describe("updateKnowledge", () => {
    it("updates existing knowledge", () => {
      const { id } = storeKnowledge({
        title: "Old title",
        content: "Old content",
        tags: [],
        scope: "global",
      });
      const result = updateKnowledge({ id, title: "New title" });
      expect(result.success).toBe(true);
    });

    it("throws for non-existent id", () => {
      expect(() => updateKnowledge({ id: "fake-id", title: "x" })).toThrow("not found");
    });
  });

  describe("deleteKnowledge", () => {
    it("deletes existing knowledge", () => {
      const { id } = storeKnowledge({
        title: "To delete",
        content: "Will be removed",
        tags: [],
        scope: "global",
      });
      const result = deleteKnowledge({ id });
      expect(result.success).toBe(true);
      expect(result.id).toBe(id);

      // Verify it's gone
      const search = searchKnowledge({ query: "To delete", scope: "global" });
      expect(search.results).toHaveLength(0);
    });

    it("throws for non-existent id", () => {
      expect(() => deleteKnowledge({ id: "fake-id" })).toThrow("not found");
    });
  });

  describe("closeDb", () => {
    it("can be called multiple times safely", () => {
      closeDb();
      closeDb(); // should not throw
    });
  });
});
