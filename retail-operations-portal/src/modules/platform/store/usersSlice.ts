import type { User } from "../types";
import { createListSlice } from "@/shared/store/createListSlice";

export const usersSlice = createListSlice<User>("users");
export const { setItems: setUsers, upsertItem: upsertUser } = usersSlice.actions;
