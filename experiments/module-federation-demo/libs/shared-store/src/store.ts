import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice';

// Module singleton: Module Federation's `singleton: true` sharing ensures every
// remote and the host resolve to this exact instance instead of their own copy.
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },
});

// store.replaceReducer() //

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
