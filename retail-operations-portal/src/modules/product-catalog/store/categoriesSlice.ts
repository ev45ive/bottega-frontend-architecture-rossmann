import type { Category } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const categoriesSlice = createListSlice<Category>("categories");
export const { setItems: setCategories } = categoriesSlice.actions;
