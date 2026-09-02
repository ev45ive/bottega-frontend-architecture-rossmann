import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../types";

// No login screen yet (Tier 3, added Day 3) — a hardcoded "logged in" user for now.
const hardcodedUser: User = {
  id: "user-1",
  name: "Jan Kowalski",
  email: "jan.kowalski@retailops.pl",
  role: "admin",
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: hardcodedUser,
  reducers: {},
});
