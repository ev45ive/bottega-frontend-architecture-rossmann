import promotionsRaw from "@/mock-data/promotions.json";
import type { Promotion } from "@/types";
import { delay } from "./delay";

const db = new Map<string, Promotion>(promotionsRaw.map((p) => [p.id, p as Promotion]));

export async function listPromotions(): Promise<Promotion[]> {
  await delay();
  return [...db.values()];
}

export async function getPromotion(id: string): Promise<Promotion | null> {
  await delay();
  return db.get(id) ?? null;
}

export async function createPromotion(
  draft: Omit<Promotion, "id" | "status">,
): Promise<Promotion> {
  await delay();
  const id = `promo-${db.size + 1}-${Date.now()}`;
  const next: Promotion = { ...draft, id, status: "draft" };
  db.set(id, next);
  return next;
}

export async function updatePromotion(id: string, patch: Partial<Promotion>): Promise<Promotion> {
  await delay();
  const current = db.get(id);
  if (!current) throw new Error(`Promotion ${id} not found`);
  const next = { ...current, ...patch };
  db.set(id, next);
  return next;
}

export async function selectProductsForPromotion(
  id: string,
  productIds: string[],
): Promise<Promotion> {
  return updatePromotion(id, { productIds });
}

export async function submitPromotionForValidation(id: string): Promise<Promotion> {
  return updatePromotion(id, { status: "pending_validation" });
}

// Naive rule-based check standing in for a real validation service.
export async function runValidation(id: string): Promise<Promotion> {
  await delay(500);
  const current = db.get(id);
  if (!current) throw new Error(`Promotion ${id} not found`);
  const issues: string[] = [];
  if (current.productIds.length === 0) issues.push("Brak wybranych produktów");
  if (current.pricingRuleIds.length === 0) issues.push("Brak reguły cenowej");
  const validation = { passed: issues.length === 0, issues, checkedAt: new Date().toISOString() };
  const next: Promotion = {
    ...current,
    validation,
    status: validation.passed ? "pending_approval" : "draft",
  };
  db.set(id, next);
  return next;
}

export async function approvePromotion(id: string, approvedBy: string): Promise<Promotion> {
  return updatePromotion(id, { status: "active", approvedBy, activatedAt: undefined });
}

export async function rejectPromotion(id: string, _reason: string): Promise<Promotion> {
  return updatePromotion(id, { status: "draft" });
}

export async function activatePromotion(id: string): Promise<Promotion> {
  return updatePromotion(id, { status: "active", activatedAt: new Date().toISOString() });
}

export async function deactivatePromotion(id: string): Promise<Promotion> {
  return updatePromotion(id, { status: "draft", activatedAt: undefined });
}

export async function archivePromotion(id: string): Promise<Promotion> {
  return updatePromotion(id, { status: "archived" });
}
