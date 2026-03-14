import { execSync } from "child_process";
import fsExtra from "fs-extra";
const { pathExists, ensureDir } = fsExtra;
import { join } from "path";
import { GlobalConfig } from "./GlobalConfig.js";

export class RegistryManager {
  async resolve(alias: string): Promise<string> {
    const registries = await GlobalConfig.getRegistries();
    const url = registries[alias];
    if (!url) {
      throw new Error(
        `Registry "${alias}" not found. Add it with: sandwich registry add ${alias} <git-url>`
      );
    }
    return url;
  }

  async ensureCached(alias: string): Promise<string> {
    await GlobalConfig.ensureHome();
    const url = await this.resolve(alias);

    // Validate URL before passing to git
    if (!/^https?:\/\/.+/i.test(url) && !/^git@.+:.+/i.test(url)) {
      throw new Error(`Invalid registry URL for "${alias}": ${url}`);
    }

    // alias is e.g. "anthropics/skills" → cache at ~/.sandwich/cache/anthropics/skills/
    const cacheDir = join(GlobalConfig.cacheDir, alias);

    if (await pathExists(join(cacheDir, ".git"))) {
      this.exec(`git -C "${cacheDir}" pull --quiet`, `Updating registry ${alias}`);
    } else {
      await ensureDir(cacheDir);
      this.exec(
        `git clone --depth 1 --quiet "${url}" "${cacheDir}"`,
        `Cloning registry ${alias}`
      );
    }

    return cacheDir;
  }

  async getSkillPath(alias: string, skillName: string): Promise<string> {
    const cacheDir = await this.ensureCached(alias);
    const skillPath = join(cacheDir, "skills", skillName);
    if (!(await pathExists(skillPath))) {
      throw new Error(
        `Skill "${skillName}" not found in registry "${alias}". ` +
          `Expected path: ${skillPath}`
      );
    }
    return skillPath;
  }

  async skillExists(alias: string, skillName: string): Promise<boolean> {
    const cacheDir = join(GlobalConfig.cacheDir, alias);
    if (!(await pathExists(join(cacheDir, ".git")))) return false;
    const skillPath = join(cacheDir, "skills", skillName);
    return pathExists(skillPath);
  }

  private exec(cmd: string, description: string): void {
    try {
      execSync(cmd, { stdio: "pipe" });
    } catch (err: any) {
      throw new Error(
        `${description} failed: ${err.stderr?.toString().trim() ?? err.message}`
      );
    }
  }
}
