import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../features/contact/counterReducer";
import { catalogApi } from "../../features/catalog/catalogApi";
import { useDispatch, useSelector } from "react-redux";
import { uiSlice } from "../layout/uiSlice";
import { errorApi } from "../../features/about/errorApi";
import { cartApi } from "../../features/cart/cartApi";
import { catalogSlice } from "../../features/catalog/catalogSlice";

export const store = configureAppStore();

export function configureAppStore() {
  return configureStore({
    reducer: {
      [catalogApi.reducerPath]: catalogApi.reducer,
      [errorApi.reducerPath]: errorApi.reducer,
      [cartApi.reducerPath]: cartApi.reducer,
      counter: counterReducer,
      ui: uiSlice.reducer,
      catalog: catalogSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(catalogApi.middleware, errorApi.middleware, cartApi.middleware);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
