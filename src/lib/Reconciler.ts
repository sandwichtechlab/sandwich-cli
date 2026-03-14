import type { SandwichConfig, EnvironmentCode } from "./types.js";
import type { InstallMode } from "#adapters/adapter.interface.js";
import { RegistryManager } from "./RegistryManager.js";
import { getAdapter } from "#adapters/index.js";

export interface SkillResult {
  registry: string;
  name: string;
  env: EnvironmentCode;
  status: "installed" | "skipped" | "failed";
  error?: string;
}

export interface ReconcileReport {
  results: SkillResult[];
  summary: { installed: number; skipped: number; failed: number };
}

export async function reconcileAndInstall(
  config: SandwichConfig,
  opts: { overwrite?: boolean; mode?: InstallMode } = {},
  projectRoot = process.cwd()
): Promise<ReconcileReport> {
  const registryManager = new RegistryManager();
  const results: SkillResult[] = [];

  for (const skill of config.skills) {
    const envs = skill.environments ?? config.environments;

    for (const env of envs) {
      const result: SkillResult = {
        registry: skill.registry,
        name: skill.name,
        env,
        status: "skipped",
      };

      try {
        const adapter = getAdapter(env);

        if (!opts.overwrite && (await adapter.isSkillInstalled(skill.name, projectRoot))) {
          result.status = "skipped";
          results.push(result);
          continue;
        }

        const sourcePath = await registryManager.getSkillPath(skill.registry, skill.name);
        await adapter.installSkill(sourcePath, skill.name, projectRoot, opts.mode);
        result.status = "installed";
      } catch (err: any) {
        result.status = "failed";
        result.error = err.message ?? String(err);
      }

      results.push(result);
    }
  }

  const summary = {
    installed: results.filter((r) => r.status === "installed").length,
    skipped: results.filter((r) => r.status === "skipped").length,
    failed: results.filter((r) => r.status === "failed").length,
  };

  return { results, summary };
}
