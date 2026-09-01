import type { Notification } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const notificationsSlice = createListSlice<Notification>("notifications");
export const { setItems: setNotifications, upsertItem: upsertNotification } =
  notificationsSlice.actions;
