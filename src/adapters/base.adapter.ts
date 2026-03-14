import fsExtra from "fs-extra";
const { copy, remove, pathExists, ensureDir, outputFile } = fsExtra;
import { join, resolve } from "path";
import { symlink, lstat, readlink } from "fs/promises";
import type { EnvironmentAdapter, InitResult, InstallMode } from "./adapter.interface.js";
import type { EnvironmentCode, EnvironmentDefinition } from "#lib/types.js";

export abstract class BaseAdapter implements EnvironmentAdapter {
  abstract readonly definition: EnvironmentDefinition;

  get code(): EnvironmentCode {
    return this.definition.code;
  }

  get label(): string {
    return this.definition.label;
  }

  async initEnvironment(projectRoot: string): Promise<InitResult> {
    const { contextFileName, commandPath, skillsDir } = this.definition;
    const contextFilePath = join(projectRoot, contextFileName);

    const alreadyExisted = await pathExists(contextFilePath);

    // Create context file if not exists
    if (!alreadyExisted) {
      await outputFile(
        contextFilePath,
        this.defaultContextContent(),
        "utf-8"
      );
    }

    // Create command directory
    await ensureDir(join(projectRoot, commandPath));

    // Create skills directory if supported
    if (skillsDir) {
      await ensureDir(join(projectRoot, skillsDir));
    }

    return {
      env: this.code,
      contextFile: contextFilePath,
      commandPath: join(projectRoot, commandPath),
      skillsDir: skillsDir ? join(projectRoot, skillsDir) : undefined,
      alreadyExisted,
    };
  }

  getSkillPath(skillName: string, projectRoot: string): string {
    const skillsDir = this.definition.skillsDir;
    if (!skillsDir) {
      throw new Error(`Environment "${this.code}" does not support skills.`);
    }
    return join(projectRoot, skillsDir, skillName);
  }

  async isSkillInstalled(skillName: string, projectRoot: string): Promise<boolean> {
    if (!this.definition.skillsDir) return false;
    return pathExists(this.getSkillPath(skillName, projectRoot));
  }

  async installSkill(
    skillSourcePath: string,
    skillName: string,
    projectRoot: string,
    mode: InstallMode = "clone"
  ): Promise<void> {
    if (!this.definition.skillsDir) {
      throw new Error(`Environment "${this.code}" does not support skills.`);
    }
    const dest = this.getSkillPath(skillName, projectRoot);

    if (mode === "symlink") {
      // Remove existing file/dir/symlink before creating new symlink
      const exists = await pathExists(dest);
      if (exists) {
        await remove(dest);
      }
      const absoluteSource = resolve(skillSourcePath);
      await ensureDir(join(projectRoot, this.definition.skillsDir));
      await symlink(absoluteSource, dest, "dir");
    } else {
      await copy(skillSourcePath, dest, { overwrite: true });
    }
  }

  async removeSkill(skillName: string, projectRoot: string): Promise<void> {
    if (!this.definition.skillsDir) return;
    await remove(this.getSkillPath(skillName, projectRoot));
  }

  protected defaultContextContent(): string {
    return `# ${this.label}\n\nThis file provides context for ${this.label}.\n`;
  }
}
