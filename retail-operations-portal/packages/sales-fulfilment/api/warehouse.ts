import warehouseRaw from "../mock-data/warehouse.json";
import type { WarehouseStock } from "../types";
import { delay } from "@/shared/lib/delay";

const db = new Map<string, WarehouseStock>(warehouseRaw.map((w) => [w.id, w as WarehouseStock]));

export async function listWarehouseStock(): Promise<WarehouseStock[]> {
  await delay();
  return [...db.values()];
}

export async function getStockForProduct(productId: string): Promise<WarehouseStock[]> {
  await delay();
  return [...db.values()].filter((w) => w.productId === productId);
}

export async function adjustStock(id: string, delta: number): Promise<WarehouseStock> {
  await delay();
  const current = db.get(id);
  if (!current) throw new Error(`Warehouse record ${id} not found`);
  const next = { ...current, quantity: current.quantity + delta };
  db.set(id, next);
  return next;
}
