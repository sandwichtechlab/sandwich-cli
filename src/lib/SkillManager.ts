import type { SkillEntry, EnvironmentCode } from "./types.js";
import type { InstallMode } from "#adapters/adapter.interface.js";
import { ConfigManager } from "./ConfigManager.js";
import { RegistryManager } from "./RegistryManager.js";
import { getAdapter } from "#adapters/index.js";

export interface InstalledSkill {
  registry: string;
  name: string;
  environments: EnvironmentCode[];
}

export class SkillManager {
  constructor(
    private config: ConfigManager,
    private registry: RegistryManager,
    private projectRoot = process.cwd()
  ) {}

  async addSkill(
    registryAlias: string,
    skillName: string,
    environments?: EnvironmentCode[],
    mode?: InstallMode
  ): Promise<void> {
    // Validate skill exists in registry cache
    await this.registry.getSkillPath(registryAlias, skillName);

    const entry: SkillEntry = {
      registry: registryAlias,
      name: skillName,
      ...(environments ? { environments } : {}),
    };

    await this.config.addSkill(entry);

    // Install immediately
    const cfg = await this.config.read();
    const envs = environments ?? cfg.environments;
    await this.installSkillToEnvs(registryAlias, skillName, envs, mode);
  }

  async removeSkill(registryAlias: string, skillName: string): Promise<boolean> {
    // Read config first to check existence and get environments
    const cfg = await this.config.read();
    const entry = cfg.skills.find(
      (s) => s.registry === registryAlias && s.name === skillName
    );
    if (!entry) return false;

    // Remove files first — if this fails, config still lists the skill (recoverable)
    const envs = entry.environments ?? cfg.environments;
    for (const env of envs) {
      try {
        const adapter = getAdapter(env);
        await adapter.removeSkill(skillName, this.projectRoot);
      } catch {
        // best-effort removal
      }
    }

    // Remove from config only after files are cleaned up
    await this.config.removeSkill(registryAlias, skillName);
    return true;
  }

  async listSkills(): Promise<InstalledSkill[]> {
    const cfg = await this.config.read();
    return cfg.skills.map((s) => ({
      registry: s.registry,
      name: s.name,
      environments: s.environments ?? cfg.environments,
    }));
  }

  async updateSkill(registryAlias: string, skillName: string, mode?: InstallMode): Promise<void> {
    const sourcePath = await this.registry.getSkillPath(registryAlias, skillName);
    const cfg = await this.config.read();
    const entry = cfg.skills.find(
      (s) => s.registry === registryAlias && s.name === skillName
    );
    if (!entry) {
      throw new Error(`Skill "${skillName}" not found in sandwich.json`);
    }
    const envs = entry.environments ?? cfg.environments;
    for (const env of envs) {
      const adapter = getAdapter(env);
      await adapter.installSkill(sourcePath, skillName, this.projectRoot, mode);
    }
  }

  private async installSkillToEnvs(
    registryAlias: string,
    skillName: string,
    envs: EnvironmentCode[],
    mode?: InstallMode
  ): Promise<void> {
    const sourcePath = await this.registry.getSkillPath(registryAlias, skillName);
    for (const env of envs) {
      const adapter = getAdapter(env);
      await adapter.installSkill(sourcePath, skillName, this.projectRoot, mode);
    }
  }
}
