import type { Promotion } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const promotionsSlice = createListSlice<Promotion>("promotions");
export const { setItems: setPromotions, upsertItem: upsertPromotion } = promotionsSlice.actions;
