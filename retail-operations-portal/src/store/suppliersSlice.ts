import type { Supplier } from "@/types";
import { createListSlice } from "./createListSlice";

export const suppliersSlice = createListSlice<Supplier>("suppliers");
export const { setItems: setSuppliers, upsertItem: upsertSupplier } = suppliersSlice.actions;
