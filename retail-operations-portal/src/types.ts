// Shared DTOs used across every domain — intentionally one flat file (brownfield anti-pattern).
export type ID = string;

export interface Category {
  id: ID;
  name: string;
}

export interface Product {
  id: ID;
  sku: string;
  name: string;
  categoryId: ID;
  price: number;
  unit: string;
  status: "active" | "inactive";
}

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

export interface PricingRule {
  id: ID;
  name: string;
  type: "percentage" | "fixed" | "bundle";
  value: number;
  categoryId?: ID;
  active: boolean;
}

export type PromotionStatus =
  | "draft"
  | "pending_validation"
  | "pending_approval"
  | "active"
  | "archived";

export interface ValidationResult {
  passed: boolean;
  issues: string[];
  checkedAt: string;
}

export interface Promotion {
  id: ID;
  name: string;
  status: PromotionStatus;
  productIds: ID[];
  pricingRuleIds: ID[];
  startDate: string;
  endDate: string;
  createdBy: string;
  validation?: ValidationResult;
  approvedBy?: string;
  activatedAt?: string;
}

export interface CustomerSegment {
  id: ID;
  name: string;
  description: string;
  criteria: string;
}

export type ReturnStatus = "requested" | "approved" | "rejected" | "refunded";

export interface ReturnRequest {
  id: ID;
  orderId: ID;
  reason: string;
  status: ReturnStatus;
  createdAt: string;
}

export interface Notification {
  id: ID;
  message: string;
  read: boolean;
  createdAt: string;
  type: "info" | "warning" | "success";
}

export interface AuditLogEntry {
  id: ID;
  entityType: string;
  entityId: ID;
  action: string;
  actor: string;
  timestamp: string;
  details?: string;
}

export type UserRole = "admin" | "manager" | "viewer";

export interface User {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
}

export interface FeatureFlag {
  key: string;
  label: string;
  enabled: boolean;
}
