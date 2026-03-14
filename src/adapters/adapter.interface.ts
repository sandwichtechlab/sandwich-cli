import type { EnvironmentCode, EnvironmentDefinition } from "#lib/types.js";

export type InstallMode = "clone" | "symlink";

export interface EnvironmentAdapter {
  readonly definition: EnvironmentDefinition;
  readonly code: EnvironmentCode;
  readonly label: string;
  /** Create context file + command/skill directories at project root */
  initEnvironment(projectRoot: string): Promise<InitResult>;
  installSkill(skillSourcePath: string, skillName: string, projectRoot: string, mode?: InstallMode): Promise<void>;
  removeSkill(skillName: string, projectRoot: string): Promise<void>;
  isSkillInstalled(skillName: string, projectRoot: string): Promise<boolean>;
  getSkillPath(skillName: string, projectRoot: string): string;
}

export interface InitResult {
  env: EnvironmentCode;
  contextFile: string;
  commandPath: string;
  skillsDir?: string;
  alreadyExisted: boolean;
}
