import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchCalendarDataByBrandId,
  getUserDetails,
} from "@/services/userServices"; // Using your existing API function
import { Brand, BrandKit } from "../feature/brandSlice";

// Create the thunk
export const fetchUserBrands = createAsyncThunk(
  "brand/fetchUserBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserDetails();
      const rawBrandData = response.data;
      // console.log(rawBrandData,"in the thunk")

      // Handle cases where the API returns no data or an unexpected format
      if (!Array.isArray(rawBrandData)) {
        console.warn(
          "API did not return a data array for brands, returning empty."
        );
        return []; // Return an empty array to prevent crashing
      }

      // Create a mutable copy and sort the raw data before filtering and mapping
      const sortedRawData = [...rawBrandData].sort((a, b) => {
        const dateA = a.kitData?.created_date;
        const dateB = b.kitData?.created_date;

        // Logic to push brands without a creation date to the bottom
        if (!dateB) return -1;
        if (!dateA) return 1;

        // Compare dates to sort the newest ones first
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

      // CORE LOGIC: Filter and transform the now-sorted data
      const transformedBrands: Brand[] = sortedRawData
        // 1. Filter out any brands that don't have a brandProfileId
        .filter((item: any) => item.brandProfileId)
        // 2. Map the remaining valid items to the Brand interface
        .map((item: any) => {
          const hasKitData =
            item.kitData && Object.keys(item.kitData).length > 0;

          // Transform kitData into the BrandKit structure
          const brandKits: BrandKit[] = hasKitData
            ? [
                {
                  id: item.kitData._id,
                  name: item.kitData.brand_name,
                  assets: [
                    item.kitData.assets?.logo_path,
                    item.kitData.assets?.mascot_path,
                    ...(item.kitData.assets?.additional_images || []),
                  ].filter(Boolean), // Remove any null/undefined paths
                  createdAt: item.kitData.created_date,
                  kitData: item.kitData,
                  userId: item.kitData.userId,
                  brandProfileId: item.kitData.brandProfileId,
                  created_at: item.kitData.created_at,
                  updated_at: item.kitData.updated_at,
                },
              ]
            : [];

          return {
            id: item.brandProfileId,
            profileId: item.brandProfileId,
            name: hasKitData ? item.kitData.brand_name : "Unnamed Brand",
            logoUrl: hasKitData ? item.kitData.assets?.logo_path : undefined,
            brandKits: brandKits,
            status: "completed",
            isDefault: false,
          };
        });

      return transformedBrands;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCalendarForBrand = createAsyncThunk(
  "brand/fetchCalendarForBrand",
  async (brand: Brand, { rejectWithValue }) => {
    // Don't fetch for the default brand as it has no profileId
    if (brand.isDefault || !brand.profileId) {
      return rejectWithValue(
        "Cannot fetch calendar for default or invalid brand."
      );
    }

    try {
      const response = await fetchCalendarDataByBrandId(brand.profileId);

      // Safely extract the nested calendar data using optional chaining (?.)
      const calendarData =
        response.data?.[0]?.campaignPlans?.[0]?.contentCalander?.[0]?.result;

      // If calendarData is found, return it. Otherwise, return an empty array.
      return {
        brandId: brand.id,
        calendarData: calendarData || [],
      };
    } catch (error: any) {
      console.error(`Failed to fetch calendar for brand ${brand.id}`, error);
      return rejectWithValue(error.message);
    }
  }
);
