import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ProductDetailsPage } from "@/pages/ProductDetailsPage";
import { PromotionsPage } from "@/pages/PromotionsPage";
import { PromotionWizardPage } from "@/pages/PromotionWizardPage";
import { PromotionDetailsPage } from "@/pages/PromotionDetailsPage";
import { PricingRulesPage } from "@/pages/PricingRulesPage";
import { ValidationQueuePage } from "@/pages/ValidationQueuePage";
import { ApprovalsPage } from "@/pages/ApprovalsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SuppliersPage } from "@/pages/SuppliersPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { WarehousePage } from "@/pages/WarehousePage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { CustomerSegmentsPage } from "@/pages/CustomerSegmentsPage";
import { ReturnsPage } from "@/pages/ReturnsPage";
import { ImportExportPage } from "@/pages/ImportExportPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { AuditLogPage } from "@/pages/AuditLogPage";
import { UsersPage } from "@/pages/UsersPage";

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
