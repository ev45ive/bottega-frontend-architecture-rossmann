import type { Product } from "@/types";
import { createListSlice } from "./createListSlice";

export const productsSlice = createListSlice<Product>("products");
export const { setItems: setProducts, upsertItem: upsertProduct } = productsSlice.actions;
