import type { ID } from "@/shared/types";

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
