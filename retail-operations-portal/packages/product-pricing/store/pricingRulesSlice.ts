import type { PricingRule } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const pricingRulesSlice = createListSlice<PricingRule>("pricingRules");
export const { setItems: setPricingRules, upsertItem: upsertPricingRule } =
  pricingRulesSlice.actions;
