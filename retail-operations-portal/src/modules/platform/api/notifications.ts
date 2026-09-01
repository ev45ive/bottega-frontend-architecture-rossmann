import notificationsRaw from "../mock-data/notifications.json";
import type { Notification } from "../types";
import { delay } from "@/shared/lib/delay";

const db = new Map<string, Notification>(notificationsRaw.map((n) => [n.id, n as Notification]));

export async function listNotifications(): Promise<Notification[]> {
  await delay();
  return [...db.values()];
}

export async function markNotificationRead(id: string): Promise<Notification> {
  await delay();
  const current = db.get(id);
  if (!current) throw new Error(`Notification ${id} not found`);
  const next = { ...current, read: true };
  db.set(id, next);
  return next;
}
