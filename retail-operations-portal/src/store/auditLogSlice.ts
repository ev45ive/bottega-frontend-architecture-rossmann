import type { AuditLogEntry } from "@/types";
import { createListSlice } from "./createListSlice";

export const auditLogSlice = createListSlice<AuditLogEntry>("auditLog");
export const { setItems: setAuditLog, upsertItem: upsertAuditLogEntry } = auditLogSlice.actions;
