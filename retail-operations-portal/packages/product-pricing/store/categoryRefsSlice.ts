import type { CategoryRef } from "@/modules/product-catalog";
import { createListSlice } from "@/shared/store/createListSlice";

export const categoryRefsSlice = createListSlice<CategoryRef>("categoryRefs");
export const { setItems: setCategoryRefs } = categoryRefsSlice.actions;
