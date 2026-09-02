import auditLogRaw from "../mock-data/auditLog.json";
import type { AuditLogEntry } from "../types";
import { delay } from "@/shared/lib/delay";

const db = new Map<string, AuditLogEntry>(auditLogRaw.map((a) => [a.id, a as AuditLogEntry]));

export async function listAuditLog(): Promise<AuditLogEntry[]> {
  await delay();
  return [...db.values()].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export async function addAuditLogEntry(entry: Omit<AuditLogEntry, "id">): Promise<AuditLogEntry> {
  await delay();
  const id = `audit-${db.size + 1}-${Date.now()}`;
  const next: AuditLogEntry = { ...entry, id };
  db.set(id, next);
  return next;
}
