import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layout/AppLayout";
import { DashboardPage } from "./DashboardPage";
import { ProductsPage, ProductDetailsPage, CategoriesPage, ImportExportPage } from "@/modules/product-catalog";
import {
  PromotionsPage,
  PromotionWizardPage,
  PromotionDetailsPage,
  PricingRulesPage,
  ValidationQueuePage,
  ApprovalsPage,
  CustomerSegmentsPage,
} from "@/modules/product-pricing";
import { ReportsPage, NotificationsPage, AuditLogPage, UsersPage } from "@/modules/platform";
import { SuppliersPage, OrdersPage, WarehousePage, ReturnsPage } from "@/modules/sales-fulfilment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetailsPage /> },
      { path: "promotions", element: <PromotionsPage /> },
      { path: "promotions/new", element: <PromotionWizardPage /> },
      { path: "promotions/:id", element: <PromotionDetailsPage /> },
      { path: "pricing-rules", element: <PricingRulesPage /> },
      { path: "validation-queue", element: <ValidationQueuePage /> },
      { path: "approvals", element: <ApprovalsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "suppliers", element: <SuppliersPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "warehouse", element: <WarehousePage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "customer-segments", element: <CustomerSegmentsPage /> },
      { path: "returns", element: <ReturnsPage /> },
      { path: "import-export", element: <ImportExportPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "audit-log", element: <AuditLogPage /> },
      { path: "settings/users", element: <UsersPage /> },
    ],
  },
]);
