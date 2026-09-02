import { createSlice, createEntityAdapter, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

const cartAdapter = createEntityAdapter<CartItem>();

// Stand-in for a real backend so the async thunks below have something to await.
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let mockServerCart: CartItem[] = [];

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  await delay(300);
  return mockServerCart;
});

export const syncCart = createAsyncThunk('cart/sync', async (items: CartItem[]) => {
  await delay(300);
  mockServerCart = items;
  return items;
});

interface CartExtraState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  syncStatus: 'idle' | 'saving' | 'saved' | 'failed';
}

const initialState = cartAdapter.getInitialState<CartExtraState>({
  status: 'idle',
  syncStatus: 'idle',
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    itemAdded: cartAdapter.addOne,
    itemRemoved: cartAdapter.removeOne,
    cartCleared: cartAdapter.removeAll,
    quantityChanged(state, action: PayloadAction<{ id: string; qty: number }>) {
      const { id, qty } = action.payload;
      if (qty <= 0) {
        cartAdapter.removeOne(state, id);
      } else {
        cartAdapter.updateOne(state, { id, changes: { qty } });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        cartAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCart.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(syncCart.pending, (state) => {
        state.syncStatus = 'saving';
      })
      .addCase(syncCart.fulfilled, (state) => {
        state.syncStatus = 'saved';
      })
      .addCase(syncCart.rejected, (state) => {
        state.syncStatus = 'failed';
      });
  },
});

export const { itemAdded, itemRemoved, cartCleared, quantityChanged } = cartSlice.actions;
export const cartSelectors = cartAdapter.getSelectors();
export default cartSlice.reducer;
export type CartState = ReturnType<typeof cartSlice.reducer>;
