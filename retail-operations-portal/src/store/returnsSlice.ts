import type { ReturnRequest } from "@/types";
import { createListSlice } from "./createListSlice";

export const returnsSlice = createListSlice<ReturnRequest>("returns");
export const { setItems: setReturns, upsertItem: upsertReturn } = returnsSlice.actions;
