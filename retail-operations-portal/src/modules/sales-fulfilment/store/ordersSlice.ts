import type { Order } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const ordersSlice = createListSlice<Order>("orders");
export const { setItems: setOrders, upsertItem: upsertOrder } = ordersSlice.actions;
