import type { ID } from "@/shared/types";

export interface Supplier {
  id: ID;
  name: string;
  contactEmail: string;
  country: string;
  status: "active" | "inactive";
}

export type OrderStatus = "new" | "approved" | "shipped" | "cancelled";

export interface Order {
  id: ID;
  orderNumber: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface WarehouseStock {
  id: ID;
  productId: ID;
  location: string;
  quantity: number;
  reserved: number;
}

export type ReturnStatus = "requested" | "approved" | "rejected" | "refunded";

export interface ReturnRequest {
  id: ID;
  orderId: ID;
  reason: string;
  status: ReturnStatus;
  createdAt: string;
}
