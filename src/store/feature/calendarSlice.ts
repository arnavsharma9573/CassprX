import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CampaignData } from "@/types/calender"; // Ensure this type matches your mock response
import { campaignData as mockData } from "@/utils/mockApiResponse"; // We'll use this for our mock API
import { finalizeChatAndGenerateCalendar } from "./chatSlice";

// In a real application, this would use fetch or axios to call your backend.
const fetchCampaignApi = (brandId: string): Promise<CampaignData> => {
  return new Promise((resolve) => {
    console.log(`Fetching campaign data for brand ID: ${brandId}...`);
    // Simulate a 1-second network delay
    setTimeout(() => {
      console.log("...Data fetched successfully.");
      // For this example, we return the same mock data regardless of brandId.
      // In a real app, the API would return data specific to the brand.
      resolve(mockData);
    }, 1000);
  });
};

// Create an async thunk to fetch the data
export const fetchCalendarDataByBrandId = createAsyncThunk(
  "calendar/fetchByBrandId",
  async (brandId: string, { rejectWithValue }) => {
    try {
      const data = await fetchCampaignApi(brandId);
      // The return value becomes the `fulfilled` action payload
      return { brandId, data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Define the shape of our slice's state
interface CalendarState {
  // Use a dictionary to cache data for each brandId
  dataByBrand: Record<string, CampaignData>;
  loading: boolean;
  error: string | null;
  currentBrandId: string | null; // Track which brand is currently being fetched
}

const initialState: CalendarState = {
  dataByBrand: {},
  loading: false,
  error: null,
  currentBrandId: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
  // Handle actions from createAsyncThunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarDataByBrandId.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentBrandId = action.meta.arg; // The brandId passed to the thunk
      })
      .addCase(fetchCalendarDataByBrandId.fulfilled, (state, action) => {
        state.loading = false;
        // Store the fetched data, keyed by its brandId
        state.dataByBrand[action.payload.brandId] = action.payload.data;
      })
      .addCase(fetchCalendarDataByBrandId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(finalizeChatAndGenerateCalendar.fulfilled, (state, action) => {
        // This action is dispatched from chatSlice, but this slice can react to it!
        state.dataByBrand[action.payload.brandId] = action.payload.data;
      });
  },
});

export default calendarSlice.reducer;
