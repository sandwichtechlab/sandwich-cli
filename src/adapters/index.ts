import { ENVIRONMENT_DEFINITIONS } from "#lib/types.js";
import type { EnvironmentCode } from "#lib/types.js";
import { BaseAdapter } from "./base.adapter.js";
import type { EnvironmentAdapter } from "./adapter.interface.js";

// Dynamically create one adapter per environment definition
class GenericAdapter extends BaseAdapter {
  constructor(public readonly definition: (typeof ENVIRONMENT_DEFINITIONS)[EnvironmentCode]) {
    super();
  }
}

const adapterMap = new Map<EnvironmentCode, EnvironmentAdapter>(
  (Object.values(ENVIRONMENT_DEFINITIONS) as (typeof ENVIRONMENT_DEFINITIONS)[EnvironmentCode][]).map(
    (def) => [def.code, new GenericAdapter(def)]
  )
);

export function getAdapter(code: EnvironmentCode): EnvironmentAdapter {
  const adapter = adapterMap.get(code);
  if (!adapter) throw new Error(`Unknown environment: "${code}"`);
  return adapter;
}

export function getAllAdapters(): EnvironmentAdapter[] {
  return [...adapterMap.values()];
}

export function getSupportedEnvironments(): EnvironmentCode[] {
  return [...adapterMap.keys()];
}

export type { EnvironmentAdapter };
