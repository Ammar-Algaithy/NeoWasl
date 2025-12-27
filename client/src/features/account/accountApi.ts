import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { router } from "../../app/routes/Routes";
import { cartApi } from "../cart/cartApi";
import type { User } from "../../app/models/User";

/* -----------------------------
   Types
----------------------------- */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  businessName?: string;
  shippingAddress?: AddressDto;
}

export interface AddressDto {
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

/* -----------------------------
   API
----------------------------- */

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["UserInfo"],
  endpoints: (builder) => ({
    /* ---------- AUTH ---------- */

    login: builder.mutation<User, LoginRequest>({
        query: (creds) => ({
            url: "login?useCookies=true",
            method: "POST",
            body: creds,
        }),
        async onQueryStarted(_, {dispatch, queryFulfilled}) {
          try {
            await queryFulfilled;
            dispatch(accountApi.util.invalidateTags(['UserInfo']))
          } catch (error) {
            console.log(error)
          }
        }
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (data) => ({
        url: "account/register",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "account/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          // 401 here is fine (already logged out / expired session)
          console.warn("Logout API failed (likely expired session):", err);
        } finally {
          // ✅ Clear RTK Query caches so old cart does not render
          dispatch(cartApi.util.resetApiState());
          dispatch(accountApi.util.resetApiState());
          // dispatch(favoritesApi.util.resetApiState()); // optional

          // ✅ Always go to sign-in
          router.navigate("/sign-in");
        }
      },
    }),

    /* ---------- USER ---------- */

    userInfo: builder.query<User, void>({
      query: () => "account/user-info"
    }),

    /* ---------- ADDRESS ---------- */

    getAddress: builder.query<AddressDto | null, void>({
      query: () => "account/address",
      providesTags: ["UserInfo"],
    }),

    saveAddress: builder.mutation<AddressDto, AddressDto>({
      query: (address) => ({
        url: "account/address",
        method: "POST",
        body: address,
      }),
    }),
  }),
});

/* -----------------------------
   Hooks
----------------------------- */

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUserInfoQuery,
  useGetAddressQuery,
  useSaveAddressMutation,
} = accountApi;
