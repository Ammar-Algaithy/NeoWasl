import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import type { Product } from "../../app/models/product";

export type PaginationMetaData = {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type PagedResponse<T> = {
  items: T[];
  meta: PaginationMetaData | null;
};

export type FilterCount = { name: string; count: number };

export type CatalogFiltersResponse = {
  brands: FilterCount[];
  types: FilterCount[];
};

export type GetProductsByCategoryArgs = {
  category: string;
  businessType?: string;
  pageNumber?: number;
  pageSize?: number;

  searchTerm?: string;
  orderBy?: string;
  brands?: string[];
  types?: string[];
};

export type GetCatalogArgs = GetProductsByCategoryArgs;

function toCsv(values?: string[]) {
  if (!values || values.length === 0) return undefined;
  return values.join(",");
}

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Catalog", "Filters"],

  endpoints: (builder) => ({
    // ✅ Keep old hook working
    getProducts: builder.query<Product[], void>({
      query: () => ({ url: "products" }),
      providesTags: ["Catalog"],
    }),

    // ✅ Keep old hook working
    fetchProductDetails: builder.query<Product, number>({
      query: (productId) => ({ url: `products/${productId}` }),
      providesTags: ["Catalog"],
    }),

    // ✅ Keep old hook name BUT upgrade it to support paging + filters
    getProductsByCategory: builder.query<PagedResponse<Product>, GetProductsByCategoryArgs>({
      query: ({
        category,
        businessType,
        pageNumber = 1,
        pageSize = 12,
        searchTerm,
        orderBy,
        brands,
        types,
      }) => ({
        url: `products/category/${encodeURIComponent(category)}`,
        params: {
          businessType,
          pageNumber,
          pageSize,
          searchTerm,
          orderBy,
          brands: toCsv(brands),
          types: toCsv(types),
        },
      }),

      transformResponse: (response: Product[], meta) => {
        const header = meta?.response?.headers.get("Pagination");
        const parsed = header ? (JSON.parse(header) as PaginationMetaData) : null;
        return { items: response, meta: parsed };
      },

      // ✅ Single cache entry per (category+businessType+filters), pages merge into it
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const keyObj = {
          category: queryArgs.category ?? "All",
          businessType: queryArgs.businessType ?? "",
          searchTerm: queryArgs.searchTerm ?? "",
          orderBy: queryArgs.orderBy ?? "",
          brands: (queryArgs.brands ?? []).slice().sort(),
          types: (queryArgs.types ?? []).slice().sort(),
          pageSize: queryArgs.pageSize ?? 12,
        };
        return `${endpointName}|${JSON.stringify(keyObj)}`;
      },

      merge: (currentCache, newData, { arg }) => {
        const page = arg.pageNumber ?? 1;

        if (page === 1) {
          currentCache.items = newData.items;
          currentCache.meta = newData.meta;
          return;
        }

        // Append + dedupe by id (NO any)
        const map = new Map<number, Product>();
        for (const p of currentCache.items) map.set(p.id, p);
        for (const p of newData.items) map.set(p.id, p);

        currentCache.items = Array.from(map.values());
        currentCache.meta = newData.meta ?? currentCache.meta;
      },

      forceRefetch: ({ currentArg, previousArg }) => {
        if (!currentArg || !previousArg) return true;

        return (
          currentArg.category !== previousArg.category ||
          currentArg.businessType !== previousArg.businessType ||
          (currentArg.searchTerm ?? "") !== (previousArg.searchTerm ?? "") ||
          (currentArg.orderBy ?? "") !== (previousArg.orderBy ?? "") ||
          (toCsv(currentArg.brands) ?? "") !== (toCsv(previousArg.brands) ?? "") ||
          (toCsv(currentArg.types) ?? "") !== (toCsv(previousArg.types) ?? "") ||
          (currentArg.pageSize ?? 12) !== (previousArg.pageSize ?? 12)
        );
      },

      providesTags: ["Catalog"],
    }),

    // ✅ New “main” hook (alias behavior: same as getProductsByCategory)
    getCatalog: builder.query<PagedResponse<Product>, GetCatalogArgs>({
      query: (args) => {
        const {
          category,
          businessType,
          pageNumber = 1,
          pageSize = 12,
          searchTerm,
          orderBy,
          brands,
          types,
        } = args;

        return {
          url: `products/category/${encodeURIComponent(category)}`,
          params: {
            businessType,
            pageNumber,
            pageSize,
            searchTerm,
            orderBy,
            brands: toCsv(brands),
            types: toCsv(types),
          },
        };
      },

      transformResponse: (response: Product[], meta) => {
        const header = meta?.response?.headers.get("Pagination");
        const parsed = header ? (JSON.parse(header) as PaginationMetaData) : null;
        return { items: response, meta: parsed };
      },

      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const keyObj = {
          category: queryArgs.category ?? "All",
          businessType: queryArgs.businessType ?? "",
          searchTerm: queryArgs.searchTerm ?? "",
          orderBy: queryArgs.orderBy ?? "",
          brands: (queryArgs.brands ?? []).slice().sort(),
          types: (queryArgs.types ?? []).slice().sort(),
          pageSize: queryArgs.pageSize ?? 12,
        };
        return `${endpointName}|${JSON.stringify(keyObj)}`;
      },

      merge: (currentCache, newData, { arg }) => {
        const page = arg.pageNumber ?? 1;

        if (page === 1) {
          currentCache.items = newData.items;
          currentCache.meta = newData.meta;
          return;
        }

        const map = new Map<number, Product>();
        for (const p of currentCache.items) map.set(p.id, p);
        for (const p of newData.items) map.set(p.id, p);

        currentCache.items = Array.from(map.values());
        currentCache.meta = newData.meta ?? currentCache.meta;
      },

      forceRefetch: ({ currentArg, previousArg }) => {
        if (!currentArg || !previousArg) return true;

        return (
          currentArg.category !== previousArg.category ||
          currentArg.businessType !== previousArg.businessType ||
          (currentArg.searchTerm ?? "") !== (previousArg.searchTerm ?? "") ||
          (currentArg.orderBy ?? "") !== (previousArg.orderBy ?? "") ||
          (toCsv(currentArg.brands) ?? "") !== (toCsv(previousArg.brands) ?? "") ||
          (toCsv(currentArg.types) ?? "") !== (toCsv(previousArg.types) ?? "") ||
          (currentArg.pageSize ?? 12) !== (previousArg.pageSize ?? 12)
        );
      },

      providesTags: ["Catalog"],
    }),

    getFilters: builder.query<CatalogFiltersResponse, { category?: string; businessType?: string; searchTerm?: string }>({
        query: ({ category, businessType, searchTerm }) => ({
            url: "products/filters",
            params: { category, businessType, searchTerm },
        }),
    }),
  }),
});

export const {
  // Old hooks
  useGetProductsQuery,
  useFetchProductDetailsQuery,
  useGetProductsByCategoryQuery,

  // New hooks
  useGetCatalogQuery,
  useGetFiltersQuery,
} = catalogApi;
