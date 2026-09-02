import type { Product } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const productsSlice = createListSlice<Product>("products");
export const { setItems: setProducts, upsertItem: upsertProduct } = productsSlice.actions;
