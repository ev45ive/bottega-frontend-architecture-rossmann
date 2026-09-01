import { useEffect } from "react";
import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useAppDispatch } from "./hooks";

// Fetches once (if not already loaded) and stores the result via the slice's setItems action.
export function useLoadList<T>(
  loaded: boolean,
  fetchFn: () => Promise<T[]>,
  setItems: ActionCreatorWithPayload<T[]>,
) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (loaded) return;
    fetchFn().then((items) => dispatch(setItems(items)));
  }, [loaded, fetchFn, setItems, dispatch]);
}
