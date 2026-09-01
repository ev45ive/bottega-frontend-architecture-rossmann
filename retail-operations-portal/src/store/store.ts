import { configureStore } from "@reduxjs/toolkit";
import { auditLogSlice } from "./auditLogSlice";
import { categoriesSlice } from "./categoriesSlice";
import { currentUserSlice } from "./currentUserSlice";
import { customerSegmentsSlice } from "./customerSegmentsSlice";
import { featureFlagsSlice } from "./featureFlagsSlice";
import { notificationsSlice } from "./notificationsSlice";
import { ordersSlice } from "./ordersSlice";
import { pricingRulesSlice } from "./pricingRulesSlice";
import { productsSlice } from "./productsSlice";
import { promotionsSlice } from "./promotionsSlice";
import { returnsSlice } from "./returnsSlice";
import { suppliersSlice } from "./suppliersSlice";
import { usersSlice } from "./usersSlice";
import { warehouseSlice } from "./warehouseSlice";

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
