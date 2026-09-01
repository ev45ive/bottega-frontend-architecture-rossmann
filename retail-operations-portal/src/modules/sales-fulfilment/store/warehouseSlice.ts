import type { WarehouseStock } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const warehouseSlice = createListSlice<WarehouseStock>("warehouse");
export const { setItems: setWarehouseStock, upsertItem: upsertWarehouseStock } =
  warehouseSlice.actions;
