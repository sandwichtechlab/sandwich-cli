import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ConfigManager } from "#lib/ConfigManager.js";
import { mkdtempSync, rmSync, readFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("ConfigManager", () => {
  let dir: string;
  let cm: ConfigManager;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "sandwich-test-"));
    cm = new ConfigManager(dir);
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("create() writes valid sandwich.json with workflow", async () => {
    const config = await cm.create(["claude"], [], [], "adlc");
    expect(config.workflow).toBe("adlc");
    expect(config.environments).toEqual(["claude"]);
    expect(config.skills).toEqual([]);

    const raw = JSON.parse(readFileSync(join(dir, "sandwich.json"), "utf-8"));
    expect(raw.workflow).toBe("adlc");
  });

  it("create() defaults workflow to sdlc", async () => {
    const config = await cm.create(["claude"]);
    expect(config.workflow).toBe("sdlc");
  });

  it("exists() returns false when no config", async () => {
    expect(await cm.exists()).toBe(false);
  });

  it("exists() returns true after create", async () => {
    await cm.create(["claude"]);
    expect(await cm.exists()).toBe(true);
  });

  it("read() throws when no config exists", async () => {
    await expect(cm.read()).rejects.toThrow("sandwich.json not found");
  });

  it("read() parses valid config", async () => {
    await cm.create(["claude", "cursor"], [], [], "adlc");
    const config = await cm.read();
    expect(config.environments).toEqual(["claude", "cursor"]);
    expect(config.workflow).toBe("adlc");
  });

  it("read() defaults workflow for legacy configs", async () => {
    // Write a config without workflow field
    const { writeFileSync } = await import("fs");
    writeFileSync(
      join(dir, "sandwich.json"),
      JSON.stringify({
        version: "1",
        environments: ["claude"],
        skills: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    const config = await cm.read();
    expect(config.workflow).toBe("sdlc");
  });

  it("addSkill() adds and deduplicates", async () => {
    await cm.create(["claude"]);
    await cm.addSkill({ registry: "r", name: "s1" });
    await cm.addSkill({ registry: "r", name: "s1" }); // duplicate

    const config = await cm.read();
    expect(config.skills).toHaveLength(1);
    expect(config.skills[0]).toEqual({ registry: "r", name: "s1" });
  });

  it("removeSkill() removes existing skill", async () => {
    await cm.create(["claude"], [{ registry: "r", name: "s1" }]);
    const removed = await cm.removeSkill("r", "s1");
    expect(removed).toBe(true);

    const config = await cm.read();
    expect(config.skills).toHaveLength(0);
  });

  it("removeSkill() returns false for non-existent skill", async () => {
    await cm.create(["claude"]);
    const removed = await cm.removeSkill("r", "nope");
    expect(removed).toBe(false);
  });

  it("addRegistry() adds and deduplicates", async () => {
    await cm.create(["claude"]);
    await cm.addRegistry({ alias: "test", url: "https://example.com/test.git" });
    await cm.addRegistry({ alias: "test", url: "https://example.com/test.git" }); // duplicate

    const config = await cm.read();
    expect(config.registries).toHaveLength(1);
  });

  it("removeRegistry() removes existing registry", async () => {
    await cm.create(["claude"]);
    await cm.addRegistry({ alias: "test", url: "https://example.com/test.git" });
    const removed = await cm.removeRegistry("test");
    expect(removed).toBe(true);

    const config = await cm.read();
    expect(config.registries).toHaveLength(0);
  });

  it("read() throws on invalid JSON", async () => {
    const { writeFileSync } = await import("fs");
    writeFileSync(join(dir, "sandwich.json"), "not json");
    await expect(cm.read()).rejects.toThrow("not valid JSON");
  });

  it("read() throws on missing environments", async () => {
    const { writeFileSync } = await import("fs");
    writeFileSync(join(dir, "sandwich.json"), JSON.stringify({ skills: [] }));
    await expect(cm.read()).rejects.toThrow('"environments" must be an array');
  });

  it("read() throws on invalid environment code", async () => {
    const { writeFileSync } = await import("fs");
    writeFileSync(
      join(dir, "sandwich.json"),
      JSON.stringify({
        version: "1",
        workflow: "sdlc",
        environments: ["claude", "invalid-env"],
        skills: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    await expect(cm.read()).rejects.toThrow('invalid environment "invalid-env"');
  });

  it("read() throws on malformed skill entry", async () => {
    const { writeFileSync } = await import("fs");
    writeFileSync(
      join(dir, "sandwich.json"),
      JSON.stringify({
        version: "1",
        workflow: "sdlc",
        environments: ["claude"],
        skills: [{ name: "test" }], // missing registry
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    await expect(cm.read()).rejects.toThrow("skills[0].registry must be a non-empty string");
  });

  it("read() throws on invalid workflow value", async () => {
    const { writeFileSync } = await import("fs");
    writeFileSync(
      join(dir, "sandwich.json"),
      JSON.stringify({
        version: "1",
        workflow: "waterfall",
        environments: ["claude"],
        skills: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    await expect(cm.read()).rejects.toThrow('"workflow" must be "sdlc" or "adlc"');
  });

  it("read() validates skill environments array", async () => {
    const { writeFileSync } = await import("fs");
    writeFileSync(
      join(dir, "sandwich.json"),
      JSON.stringify({
        version: "1",
        workflow: "sdlc",
        environments: ["claude"],
        skills: [{ registry: "r", name: "s", environments: ["invalid"] }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    await expect(cm.read()).rejects.toThrow('skills[0] has invalid environment "invalid"');
  });
});
