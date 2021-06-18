import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import Search from "./search";

const reducers = combineReducers({
  search: Search,
});

export function useStore(initialState: any) {
  const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: true,
        serializableCheck: true,
      }),
    preloadedState: initialState,
  });

  return store;
}
