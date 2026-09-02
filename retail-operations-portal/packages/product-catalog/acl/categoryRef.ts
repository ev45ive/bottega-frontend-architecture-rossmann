import type { ID } from "@/shared/types";
import type { Category } from "../types";
import { listCategories } from "../api/categories";

// Published Language for Category — the only shape other modules should depend on.
export interface CategoryRef {
  id: ID;
  name: string;
}

function toCategoryRef(category: Category): CategoryRef {
  return { id: category.id, name: category.name };
}

export async function listCategoryRefs(): Promise<CategoryRef[]> {
  const categories = await listCategories();
  return categories.map(toCategoryRef);
}
