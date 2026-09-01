import productsRaw from "@/mock-data/products.json";
import type { Product } from "@/types";
import { delay } from "./delay";

const db = new Map<string, Product>(productsRaw.map((p) => [p.id, p as Product]));

export async function listProducts(): Promise<Product[]> {
  await delay();
  return [...db.values()];
}

export async function getProduct(id: string): Promise<Product | null> {
  await delay();
  return db.get(id) ?? null;
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product> {
  await delay();
  const current = db.get(id);
  if (!current) throw new Error(`Product ${id} not found`);
  const next = { ...current, ...patch };
  db.set(id, next);
  return next;
}

// Stub: real implementation would parse the file and upsert rows into `db`.
export async function importProductsFromCsv(_file: File): Promise<{ imported: number }> {
  await delay(600);
  return { imported: 0 };
}

export async function exportProducts(): Promise<Product[]> {
  await delay(400);
  return [...db.values()];
}
