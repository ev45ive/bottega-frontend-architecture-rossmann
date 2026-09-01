import type { FeatureFlag } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const featureFlagsSlice = createListSlice<FeatureFlag>("featureFlags", "key");
export const { setItems: setFeatureFlags, upsertItem: upsertFeatureFlag } =
  featureFlagsSlice.actions;
