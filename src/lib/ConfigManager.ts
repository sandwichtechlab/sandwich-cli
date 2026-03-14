import fsExtra from "fs-extra";
const { readFile, writeFile, pathExists } = fsExtra;
import { join } from "path";
import type { SandwichConfig, SkillEntry, EnvironmentCode, RegistryEntry, WorkflowType } from "./types.js";
import { ENVIRONMENT_DEFINITIONS } from "./types.js";

const CONFIG_FILENAME = "sandwich.json";
const CONFIG_VERSION = "1";
const VALID_ENVS = new Set(Object.keys(ENVIRONMENT_DEFINITIONS));
const VALID_WORKFLOWS: Set<string> = new Set(["sdlc", "adlc"]);

export class ConfigManager {
  private readonly configPath: string;

  constructor(projectRoot = process.cwd()) {
    this.configPath = join(projectRoot, CONFIG_FILENAME);
  }

  get path(): string {
    return this.configPath;
  }

  async exists(): Promise<boolean> {
    return pathExists(this.configPath);
  }

  async read(): Promise<SandwichConfig> {
    const exists = await this.exists();
    if (!exists) {
      throw new Error(
        `${CONFIG_FILENAME} not found. Run \`sandwich init\` to create one.`
      );
    }
    const raw = await readFile(this.configPath, "utf-8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`${CONFIG_FILENAME} is not valid JSON.`);
    }
    return this.validate(parsed);
  }

  async write(config: SandwichConfig): Promise<void> {
    const updated: SandwichConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    await writeFile(this.configPath, JSON.stringify(updated, null, 2) + "\n", "utf-8");
  }

  async create(
    environments: EnvironmentCode[],
    skills: SkillEntry[] = [],
    registries: RegistryEntry[] = [],
    workflow: WorkflowType = "sdlc"
  ): Promise<SandwichConfig> {
    const now = new Date().toISOString();
    const config: SandwichConfig = {
      version: CONFIG_VERSION,
      workflow,
      environments,
      skills,
      registries: registries.length > 0 ? registries : undefined,
      createdAt: now,
      updatedAt: now,
    };
    await this.write(config);
    return config;
  }

  async addSkill(skill: SkillEntry): Promise<void> {
    const config = await this.read();
    const exists = config.skills.some(
      (s) => s.registry === skill.registry && s.name === skill.name
    );
    if (exists) return;
    config.skills.push(skill);
    await this.write(config);
  }

  async removeSkill(registry: string, name: string): Promise<boolean> {
    const config = await this.read();
    const before = config.skills.length;
    config.skills = config.skills.filter(
      (s) => !(s.registry === registry && s.name === name)
    );
    if (config.skills.length === before) return false;
    await this.write(config);
    return true;
  }

  async addRegistry(entry: RegistryEntry): Promise<void> {
    const config = await this.read();
    if (!config.registries) config.registries = [];
    const exists = config.registries.some((r) => r.alias === entry.alias);
    if (exists) return;
    config.registries.push(entry);
    await this.write(config);
  }

  async removeRegistry(alias: string): Promise<boolean> {
    const config = await this.read();
    if (!config.registries) return false;
    const before = config.registries.length;
    config.registries = config.registries.filter((r) => r.alias !== alias);
    if (config.registries.length === before) return false;
    await this.write(config);
    return true;
  }

  private validate(raw: unknown): SandwichConfig {
    if (typeof raw !== "object" || raw === null) {
      throw new Error(`${CONFIG_FILENAME} must be a JSON object.`);
    }
    const obj = raw as Record<string, unknown>;

    // Environments
    if (!Array.isArray(obj["environments"])) {
      throw new Error(`${CONFIG_FILENAME}: "environments" must be an array.`);
    }
    for (const env of obj["environments"]) {
      if (typeof env !== "string" || !VALID_ENVS.has(env)) {
        throw new Error(`${CONFIG_FILENAME}: invalid environment "${env}". Valid: ${[...VALID_ENVS].join(", ")}`);
      }
    }

    // Skills
    if (!Array.isArray(obj["skills"])) {
      throw new Error(`${CONFIG_FILENAME}: "skills" must be an array.`);
    }
    for (let i = 0; i < (obj["skills"] as unknown[]).length; i++) {
      const s = (obj["skills"] as unknown[])[i];
      if (typeof s !== "object" || s === null) {
        throw new Error(`${CONFIG_FILENAME}: skills[${i}] must be an object.`);
      }
      const skill = s as Record<string, unknown>;
      if (typeof skill["registry"] !== "string" || !skill["registry"]) {
        throw new Error(`${CONFIG_FILENAME}: skills[${i}].registry must be a non-empty string.`);
      }
      if (typeof skill["name"] !== "string" || !skill["name"]) {
        throw new Error(`${CONFIG_FILENAME}: skills[${i}].name must be a non-empty string.`);
      }
      if (skill["environments"] !== undefined) {
        if (!Array.isArray(skill["environments"])) {
          throw new Error(`${CONFIG_FILENAME}: skills[${i}].environments must be an array.`);
        }
        for (const env of skill["environments"] as unknown[]) {
          if (typeof env !== "string" || !VALID_ENVS.has(env)) {
            throw new Error(`${CONFIG_FILENAME}: skills[${i}] has invalid environment "${env}".`);
          }
        }
      }
    }

    // Workflow — default for backward compatibility
    if (!obj["workflow"]) {
      console.warn(`⚠ No "workflow" field in ${CONFIG_FILENAME}, defaulting to "sdlc". Run \`sandwich init\` to set explicitly.`);
      obj["workflow"] = "sdlc";
    } else if (!VALID_WORKFLOWS.has(obj["workflow"] as string)) {
      throw new Error(`${CONFIG_FILENAME}: "workflow" must be "sdlc" or "adlc", got "${obj["workflow"]}".`);
    }

    return obj as unknown as SandwichConfig;
  }
}
