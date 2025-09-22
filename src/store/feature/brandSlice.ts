import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// BrandKit type
export interface BrandKit {
  id: string;
  name: string;
  assets?: string[]; // logos, colors, fonts, etc. (can refine later)
  createdAt?: string;
}

// Brand type
export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt?: string;
  isDefault?: boolean; // ✅ mark if it's the built-in workspace
  brandKits?: BrandKit[]; // ✅ nested kits
}

interface BrandState {
  brands: Brand[];
  activeBrandId: string | null;
  loading: boolean;
  error: string | null;
}

const defaultBrand: Brand = {
  id: "default",
  name: "Agent Workspace",
  description: "Use AI agents without creating a brand",
  isDefault: true,
  brandKits: [],
};

const initialState: BrandState = {
  brands: [defaultBrand],
  activeBrandId: "default",
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    // ===== Brand Actions =====
    setBrands: (state, action: PayloadAction<Brand[]>) => {
      state.brands = [
        defaultBrand,
        ...action.payload.filter((b) => !b.isDefault),
      ];
      if (!state.activeBrandId) state.activeBrandId = defaultBrand.id;
    },

    addBrand: (state, action: PayloadAction<Brand>) => {
      const exists = state.brands.some((b) => b.id === action.payload.id);
      if (!exists) {
        state.brands.push({ ...action.payload, brandKits: [] });
      }
    },

    updateBrand: (state, action: PayloadAction<Brand>) => {
      const index = state.brands.findIndex(
        (b) => b.id === action.payload.id && !b.isDefault
      );
      if (index !== -1) {
        state.brands[index] = { ...state.brands[index], ...action.payload };
      }
    },

    deleteBrand: (state, action: PayloadAction<string>) => {
      if (action.payload === defaultBrand.id) return;
      state.brands = state.brands.filter((b) => b.id !== action.payload);
      if (state.activeBrandId === action.payload) {
        state.activeBrandId =
          state.brands.length > 0 ? state.brands[0].id : defaultBrand.id;
      }
    },

    setActiveBrand: (state, action: PayloadAction<string>) => {
      const exists = state.brands.some((b) => b.id === action.payload);
      if (exists) state.activeBrandId = action.payload;
    },

    // ===== BrandKit Actions =====
    addBrandKit: (
      state,
      action: PayloadAction<{ brandId: string; kit: BrandKit }>
    ) => {
      const brand = state.brands.find((b) => b.id === action.payload.brandId);
      if (brand && !brand.isDefault) {
        if (!brand.brandKits) brand.brandKits = [];
        brand.brandKits.push(action.payload.kit);
      }
    },

    updateBrandKit: (
      state,
      action: PayloadAction<{ brandId: string; kit: BrandKit }>
    ) => {
      const brand = state.brands.find((b) => b.id === action.payload.brandId);
      if (brand && brand.brandKits) {
        const index = brand.brandKits.findIndex(
          (k) => k.id === action.payload.kit.id
        );
        if (index !== -1) {
          brand.brandKits[index] = {
            ...brand.brandKits[index],
            ...action.payload.kit,
          };
        }
      }
    },

    deleteBrandKit: (
      state,
      action: PayloadAction<{ brandId: string; kitId: string }>
    ) => {
      const brand = state.brands.find((b) => b.id === action.payload.brandId);
      if (brand && brand.brandKits) {
        brand.brandKits = brand.brandKits.filter(
          (k) => k.id !== action.payload.kitId
        );
      }
    },

    // ===== Loading/Error =====
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBrands,
  addBrand,
  updateBrand,
  deleteBrand,
  setActiveBrand,
  addBrandKit,
  updateBrandKit,
  deleteBrandKit,
  setLoading,
  setError,
} = brandSlice.actions;

export default brandSlice.reducer;
