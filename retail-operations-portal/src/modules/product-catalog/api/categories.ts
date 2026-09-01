import categoriesRaw from "../mock-data/categories.json";
import type { Category } from "../types";
import { delay } from "@/shared/lib/delay";

const db = new Map<string, Category>(categoriesRaw.map((c) => [c.id, c]));

export async function listCategories(): Promise<Category[]> {
  await delay();
  return [...db.values()];
}
