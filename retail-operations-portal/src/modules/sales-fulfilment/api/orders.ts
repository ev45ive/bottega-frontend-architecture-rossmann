import ordersRaw from "../mock-data/orders.json";
import type { Order } from "../types";
import { delay } from "@/shared/lib/delay";

const db = new Map<string, Order>(ordersRaw.map((o) => [o.id, o as Order]));

export async function listOrders(): Promise<Order[]> {
  await delay();
  return [...db.values()];
}

export async function approveOrder(id: string): Promise<Order> {
  await delay();
  const current = db.get(id);
  if (!current) throw new Error(`Order ${id} not found`);
  const next: Order = { ...current, status: "approved" };
  db.set(id, next);
  return next;
}

export async function cancelOrder(id: string, _reason: string): Promise<Order> {
  await delay();
  const current = db.get(id);
  if (!current) throw new Error(`Order ${id} not found`);
  const next: Order = { ...current, status: "cancelled" };
  db.set(id, next);
  return next;
}
