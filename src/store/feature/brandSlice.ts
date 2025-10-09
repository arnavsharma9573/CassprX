import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCalendarForBrand, fetchUserBrands } from "../thunks/brandThunks";

// BrandKit type
export interface BrandKit {
  id: string; // _id from kitData
  name: string; // brand_name from kitData
  assets?: string[]; // logos, mascots, additional images
  createdAt?: string; // created_date
  kitData: {
    // full kitData from API
    _id: string;
    assets: {
      logo_path: string;
      mascot_path: string;
      additional_images: string[];
    };
    brand_name: string;
    guidelines: any; // can be null or expand later
    created_date: string;
    visual_identity?: {
      typography?: {
        primary_font: string;
      };
      color_palette?: {
        primary_colors: {
          hex: string;
          name: string;
          description?: string;
        }[];
      };
    };
    tone_and_messaging?: {
      messaging?: {
        value_proposition?: string;
      };
    };
  };
  userId: number;
  brandProfileId: string;
  created_at: string;
  updated_at: string;
}

// Brand type
export interface Brand {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt?: string;
  isDefault?: boolean;
  brandKits?: BrandKit[];
  jobId?: string;
  profileId?: string | null;
  status?: "queued" | "running" | "completed" | "failed";
  calendarData?: any;
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

    updateBrandStatus(
      state,
      action: PayloadAction<{
        id: string;
        status: Brand["status"];
        profileId: string | null;
      }>
    ) {
      const { id, status, profileId } = action.payload;
      const existingBrand = state.brands.find((brand) => brand.id === id);
      if (existingBrand) {
        existingBrand.status = status;
        existingBrand.profileId = profileId;
      }
    },

    // NEW action to find by tempId and replace with finalId
    updateBrandId(
      state,
      action: PayloadAction<{
        tempId: string;
        finalId: string;
        profileId: string;
      }>
    ) {
      const { tempId, finalId, profileId } = action.payload;
      const brandIndex = state.brands.findIndex((brand) => brand.id === tempId);

      if (brandIndex !== -1) {
        state.brands[brandIndex].id = finalId;
        state.brands[brandIndex].profileId = profileId;
        state.brands[brandIndex].status = "completed"; // Ensure status is marked as complete
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

    updateBrandKits: (
      state,
      action: PayloadAction<{ profileId: string; brandKit: BrandKit }>
    ) => {
      const { profileId, brandKit } = action.payload;
      const brand = state.brands.find((b) => b.profileId === profileId);
      if (brand) {
        // Replace any existing brandKits with the new one
        brand.brandKits = [brandKit];
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
    setCalendarData: (
      state,
      action: PayloadAction<{ brandId: string; calendarData: any }>
    ) => {
      const brand = state.brands.find((b) => b.id === action.payload.brandId);
      if (brand) {
        brand.calendarData = action.payload.calendarData;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserBrands.fulfilled,
        (state, action: PayloadAction<Brand[]>) => {
          state.loading = false;
          state.brands = [defaultBrand, ...action.payload];
          if (!state.activeBrandId) {
            state.activeBrandId = defaultBrand.id;
          }
        }
      )
      .addCase(fetchUserBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCalendarForBrand.fulfilled, (state, action) => {
        const { brandId, calendarData } = action.payload;
        const brand = state.brands.find((b) => b.id === brandId);
        if (brand) {
          brand.calendarData = calendarData;
          console.log(
            `Calendar data for brand "${brand.name}" has been updated.`
          );
        }
      })
      .addCase(fetchCalendarForBrand.rejected, (state, action) => {
        // Optionally handle the error state, e.g., by logging it
        console.error("Fetching calendar data failed:", action.payload);
      });
  },
});

export const {
  setBrands,
  addBrand,
  updateBrand,
  deleteBrand,
  setActiveBrand,
  addBrandKit,
  updateBrandKits,
  deleteBrandKit,
  updateBrandStatus,
  updateBrandId,
  setLoading,
  setError,
  setCalendarData,
} = brandSlice.actions;

export default brandSlice.reducer;
