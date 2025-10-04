import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CampaignData } from "@/types/calender";

// Create an async thunk to fetch the data
export const fetchCalendarDataByBrandId = createAsyncThunk(
  "calendar/fetchByBrandId",
  async (brandId: string, { rejectWithValue }) => {
    try {
      // Calendar data is now stored in brandSlice when calendar creation completes
      // This thunk is kept for compatibility but data should come from brandSlice
      return { brandId, data: null as CampaignData | null };
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
        // Only store data if it is not null to satisfy type constraints
        if (action.payload.data !== null) {
          state.dataByBrand[action.payload.brandId] = action.payload.data;
        }
      })
      .addCase(fetchCalendarDataByBrandId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default calendarSlice.reducer;
