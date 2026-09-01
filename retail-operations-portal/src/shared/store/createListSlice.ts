import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Draft } from "immer";

interface ListState<T> {
  items: T[];
  loaded: boolean;
}

// Generic list slice factory — every domain below is stored the same way, in the same store.
export function createListSlice<T>(name: string, keyField: keyof T = "id" as keyof T) {
  return createSlice({
    name,
    initialState: { items: [], loaded: false } as ListState<T>,
    reducers: {
      setItems(state, action: PayloadAction<T[]>) {
        state.items = action.payload as Draft<T>[];
        state.loaded = true;
      },
      upsertItem(state, action: PayloadAction<T>) {
        const items = state.items as unknown as T[];
        const idx = items.findIndex((item) => item[keyField] === action.payload[keyField]);
        if (idx >= 0) items[idx] = action.payload;
        else items.push(action.payload);
      },
    },
  });
}
