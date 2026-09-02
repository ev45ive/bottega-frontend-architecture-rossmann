import suppliersRaw from "../mock-data/suppliers.json";
import type { Supplier } from "../types";
import { delay } from "@/shared/lib/delay";

const db = new Map<string, Supplier>(suppliersRaw.map((s) => [s.id, s as Supplier]));

export async function listSuppliers(): Promise<Supplier[]> {
  await delay();
  return [...db.values()];
}

export async function getSupplier(id: string): Promise<Supplier | null> {
  await delay();
  return db.get(id) ?? null;
}

export async function updateSupplier(id: string, patch: Partial<Supplier>): Promise<Supplier> {
  await delay();
  const current = db.get(id);
  if (!current) throw new Error(`Supplier ${id} not found`);
  const next = { ...current, ...patch };
  db.set(id, next);
  return next;
}
