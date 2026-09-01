import type { Category } from "@/types";
import { createListSlice } from "./createListSlice";

export const categoriesSlice = createListSlice<Category>("categories");
export const { setItems: setCategories } = categoriesSlice.actions;
