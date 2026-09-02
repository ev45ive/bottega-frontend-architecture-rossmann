import type { ID } from "@/shared/types";

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
