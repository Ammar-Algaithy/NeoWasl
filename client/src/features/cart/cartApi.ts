import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import type { Cart } from "../../app/models/cart";

const emptyCart = (): Cart => ({
  id: 0,
  cartId: "",
  products: [],
});

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Cart"],

  endpoints: (builder) => ({
    getCartItems: builder.query<Cart, void>({
      query: () => "cart",
      providesTags: ["Cart"],

      // ✅ Prevent null from ever entering the cache
      transformResponse: (response: Cart | null): Cart => {
        return response ?? emptyCart();
      },
    }),

    addCartItem: builder.mutation<Cart, { productId: number; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `cart?productId=${productId}&quantity=${quantity}`,
        method: "POST",
      }),

      async onQueryStarted(
        { productId, quantity },
        { dispatch, queryFulfilled, getState }
      ) {
        const existing = cartApi.endpoints.getCartItems.select()(getState());

        // ✅ Type patch without PatchCollection import
        let patch: ReturnType<typeof dispatch> | undefined;

        if (existing.data) {
          patch = dispatch(
            cartApi.util.updateQueryData("getCartItems", undefined, (draft) => {
              const item = draft.products.find((p) => p.productId === productId);

              // Optimistic increment only if item already exists
              if (item) {
                item.quantity = Number(item.quantity ?? 0) + Number(quantity ?? 0);
              }
              // Do NOT insert if missing (we don't have required CartProduct fields)
            })
          );
        }

        try {
          const { data } = await queryFulfilled;
          dispatch(cartApi.util.upsertQueryData("getCartItems", undefined, data));
        } catch {
          // patch has undo() at runtime
          (patch as { undo: () => void } | undefined)?.undo();
        }
      },
    }),

    removeCartItem: builder.mutation<Cart, { productId: number; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `cart?productId=${productId}&quantity=${quantity}`,
        method: "DELETE",
      }),

      async onQueryStarted(
        { productId, quantity },
        { dispatch, queryFulfilled, getState }
      ) {
        const existing = cartApi.endpoints.getCartItems.select()(getState());

        let patch: ReturnType<typeof dispatch> | undefined;

        if (existing.data) {
          patch = dispatch(
            cartApi.util.updateQueryData("getCartItems", undefined, (draft) => {
              const item = draft.products.find((p) => p.productId === productId);
              if (!item) return;

              const nextQty =
                Number(item.quantity ?? 0) - Number(quantity ?? 0);

              if (nextQty <= 0) {
                draft.products = draft.products.filter((p) => p.productId !== productId);
              } else {
                item.quantity = nextQty;
              }
            })
          );
        }

        try {
          const { data } = await queryFulfilled;
          dispatch(cartApi.util.upsertQueryData("getCartItems", undefined, data));
        } catch {
          (patch as { undo: () => void } | undefined)?.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
