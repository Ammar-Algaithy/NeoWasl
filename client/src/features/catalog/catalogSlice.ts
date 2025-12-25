import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SortOption = "name" | "price" | "priceDesc";

interface CatalogState {
  businessType: string;

  searchTerm: string;
  orderBy: SortOption;

  selectedBrands: string[];
  selectedTypes: string[];

  pageSize: number;
}

const initialState: CatalogState = {
  businessType: "Grocery",

  searchTerm: "",
  orderBy: "name",

  selectedBrands: [],
  selectedTypes: [],

  pageSize: 12,
};

export const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setBusinessType: (state, action: PayloadAction<string>) => {
      state.businessType = action.payload;

      // optional reset when business changes
      state.searchTerm = "";
      state.orderBy = "name";
      state.selectedBrands = [];
      state.selectedTypes = [];
    },

    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    setOrderBy: (state, action: PayloadAction<SortOption>) => {
      state.orderBy = action.payload;
    },

    setSelectedBrands: (state, action: PayloadAction<string[]>) => {
      state.selectedBrands = action.payload;
    },

    setSelectedTypes: (state, action: PayloadAction<string[]>) => {
      state.selectedTypes = action.payload;
    },

    clearFilters: (state) => {
      state.searchTerm = "";
      state.orderBy = "name";
      state.selectedBrands = [];
      state.selectedTypes = [];
    },

    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
});

export const {
  setBusinessType,
  setSearchTerm,
  setOrderBy,
  setSelectedBrands,
  setSelectedTypes,
  clearFilters,
  setPageSize,
} = catalogSlice.actions;

export default catalogSlice.reducer;
