import { configureStore } from "@reduxjs/toolkit";
import { productsSlice, categoriesSlice } from "@/modules/product-catalog";
import { pricingRulesSlice, promotionsSlice, customerSegmentsSlice } from "@/modules/product-pricing";
import { ordersSlice, returnsSlice, suppliersSlice, warehouseSlice } from "@/modules/sales-fulfilment";
import {
  auditLogSlice,
  currentUserSlice,
  featureFlagsSlice,
  notificationsSlice,
  usersSlice,
} from "@/modules/platform";

// One store for every domain — intentional "global store as the app's database" anti-pattern.
export const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    categories: categoriesSlice.reducer,
    suppliers: suppliersSlice.reducer,
    orders: ordersSlice.reducer,
    warehouse: warehouseSlice.reducer,
    pricingRules: pricingRulesSlice.reducer,
    promotions: promotionsSlice.reducer,
    customerSegments: customerSegmentsSlice.reducer,
    returns: returnsSlice.reducer,
    notifications: notificationsSlice.reducer,
    auditLog: auditLogSlice.reducer,
    users: usersSlice.reducer,
    featureFlags: featureFlagsSlice.reducer,
    currentUser: currentUserSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
