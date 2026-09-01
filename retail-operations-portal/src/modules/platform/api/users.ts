import usersRaw from "../mock-data/users.json";
import type { User, UserRole } from "../types";
import { delay } from "@/shared/lib/delay";

const db = new Map<string, User>(usersRaw.map((u) => [u.id, u as User]));

export async function listUsers(): Promise<User[]> {
  await delay();
  return [...db.values()];
}

export async function assignUserRole(id: string, role: UserRole): Promise<User> {
  await delay();
  const current = db.get(id);
  if (!current) throw new Error(`User ${id} not found`);
  const next = { ...current, role };
  db.set(id, next);
  return next;
}
