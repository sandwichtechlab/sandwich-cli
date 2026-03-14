import fsExtra from "fs-extra";
const { readFile, writeFile, ensureDir, pathExists } = fsExtra;
import { join } from "path";
import { homedir } from "os";
import { BUILT_IN_REGISTRIES } from "./types.js";

const SANDWICH_HOME = join(homedir(), ".sandwich");
const REGISTRIES_FILE = join(SANDWICH_HOME, "registries.json");

export class GlobalConfig {
  static get home(): string {
    return SANDWICH_HOME;
  }

  static get cacheDir(): string {
    return join(SANDWICH_HOME, "cache");
  }

  static async ensureHome(): Promise<void> {
    await ensureDir(SANDWICH_HOME);
    await ensureDir(join(SANDWICH_HOME, "cache"));
  }

  static async getRegistries(): Promise<Record<string, string>> {
    const user = await this.readUserRegistries();
    return { ...BUILT_IN_REGISTRIES, ...user };
  }

  static async addRegistry(alias: string, url: string): Promise<void> {
    const registries = await this.readUserRegistries();
    registries[alias] = url;
    await this.writeUserRegistries(registries);
  }

  static async removeRegistry(alias: string): Promise<boolean> {
    const registries = await this.readUserRegistries();
    if (!(alias in registries)) return false;
    delete registries[alias];
    await this.writeUserRegistries(registries);
    return true;
  }

  private static async readUserRegistries(): Promise<Record<string, string>> {
    if (!(await pathExists(REGISTRIES_FILE))) return {};
    const raw = await readFile(REGISTRIES_FILE, "utf-8");
    try {
      return JSON.parse(raw) as Record<string, string>;
    } catch {
      return {};
    }
  }

  private static async writeUserRegistries(
    data: Record<string, string>
  ): Promise<void> {
    await this.ensureHome();
    await writeFile(REGISTRIES_FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");
  }
}
