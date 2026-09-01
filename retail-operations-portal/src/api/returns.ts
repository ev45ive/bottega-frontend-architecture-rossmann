import returnsRaw from "@/mock-data/returns.json";
import type { ReturnRequest, ReturnStatus } from "@/types";
import { delay } from "./delay";

const db = new Map<string, ReturnRequest>(returnsRaw.map((r) => [r.id, r as ReturnRequest]));

export async function listReturns(): Promise<ReturnRequest[]> {
  await delay();
  return [...db.values()];
}

export async function updateReturnStatus(id: string, status: ReturnStatus): Promise<ReturnRequest> {
  await delay();
  const current = db.get(id);
  if (!current) throw new Error(`Return ${id} not found`);
  const next = { ...current, status };
  db.set(id, next);
  return next;
}
