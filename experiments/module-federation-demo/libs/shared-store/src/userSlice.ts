import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  isLoggedIn: boolean;
  profile: UserProfile | null;
  sessionToken: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  profile: null,
  sessionToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loggedIn(state, action: PayloadAction<{ profile: UserProfile; sessionToken: string }>) {
      state.isLoggedIn = true;
      state.profile = action.payload.profile;
      state.sessionToken = action.payload.sessionToken;
    },
    loggedOut(state) {
      state.isLoggedIn = false;
      state.profile = null;
      state.sessionToken = null;
    },
  },
});

export const { loggedIn, loggedOut } = userSlice.actions;
export default userSlice.reducer;
export type { UserState };
