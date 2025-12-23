import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../features/contact/counterReducer";
import { catalogApi } from "../../features/catalog/catalogApi";
import { useDispatch, useSelector } from "react-redux";
import { uiSlice } from "../layout/uiSlice";

export const store = configureAppStore();

export function configureAppStore() {
  return configureStore({
    reducer: {
      [catalogApi.reducerPath]: catalogApi.reducer,
      counter: counterReducer,
      ui: uiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(catalogApi.middleware);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
