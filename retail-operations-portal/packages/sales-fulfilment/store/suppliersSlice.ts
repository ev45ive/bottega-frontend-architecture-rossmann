import type { Supplier } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const suppliersSlice = createListSlice<Supplier>("suppliers");
export const { setItems: setSuppliers, upsertItem: upsertSupplier } = suppliersSlice.actions;
