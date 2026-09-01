import type { AuditLogEntry } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const auditLogSlice = createListSlice<AuditLogEntry>("auditLog");
export const { setItems: setAuditLog, upsertItem: upsertAuditLogEntry } = auditLogSlice.actions;
