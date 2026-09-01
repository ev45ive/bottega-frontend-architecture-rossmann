import featureFlagsRaw from "../mock-data/featureFlags.json";
import type { FeatureFlag } from "../types";
import { delay } from "@/shared/lib/delay";

const db = new Map<string, FeatureFlag>(featureFlagsRaw.map((f) => [f.key, f]));

export async function listFeatureFlags(): Promise<FeatureFlag[]> {
  await delay();
  return [...db.values()];
}

export async function toggleFeatureFlag(key: string, enabled: boolean): Promise<FeatureFlag> {
  await delay();
  const current = db.get(key);
  if (!current) throw new Error(`Feature flag ${key} not found`);
  const next = { ...current, enabled };
  db.set(key, next);
  return next;
}
