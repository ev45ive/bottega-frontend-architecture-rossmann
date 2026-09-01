export type { Order, OrderStatus, ReturnRequest, ReturnStatus, WarehouseStock, Supplier } from "./types";

export { listOrders, approveOrder, cancelOrder } from "./api/orders";
export { listReturns, updateReturnStatus } from "./api/returns";
export { listWarehouseStock, getStockForProduct, adjustStock } from "./api/warehouse";
export { listSuppliers, getSupplier, updateSupplier } from "./api/suppliers";

export { ordersSlice, setOrders, upsertOrder } from "./store/ordersSlice";
export { returnsSlice, setReturns, upsertReturn } from "./store/returnsSlice";
export { warehouseSlice, setWarehouseStock, upsertWarehouseStock } from "./store/warehouseSlice";
export { suppliersSlice, setSuppliers, upsertSupplier } from "./store/suppliersSlice";

export { OrdersPage } from "./pages/OrdersPage";
export { ReturnsPage } from "./pages/ReturnsPage";
export { WarehousePage } from "./pages/WarehousePage";
export { SuppliersPage } from "./pages/SuppliersPage";
