import pricingRulesRaw from "../mock-data/pricingRules.json";
import type { PricingRule } from "../types";
import { delay } from "@/shared/lib/delay";

const db = new Map<string, PricingRule>(pricingRulesRaw.map((r) => [r.id, r as PricingRule]));

export async function listPricingRules(): Promise<PricingRule[]> {
  await delay();
  return [...db.values()];
}

export async function getPricingRule(id: string): Promise<PricingRule | null> {
  await delay();
  return db.get(id) ?? null;
}

export async function addPricingRule(rule: Omit<PricingRule, "id">): Promise<PricingRule> {
  await delay();
  const id = `pr-${db.size + 1}-${Date.now()}`;
  const next: PricingRule = { ...rule, id };
  db.set(id, next);
  return next;
}

export async function removePricingRule(id: string): Promise<void> {
  await delay();
  db.delete(id);
}
