// store/feature/chatSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CampaignData } from "@/types/calender";
import { campaignData as mockApiResponse } from "@/utils/mockApiResponse";

// --- Mock API for Calendar Generation ---
const generateCalendarApi = (
  messages: { role: string; content: string }[],
  brandId: string
): Promise<CampaignData> => {
  return new Promise((resolve) => {
    console.log(
      `Generating calendar for Brand ID: ${brandId} based on chat...`
    );
    // Simulate a 2-second generation process
    setTimeout(() => {
      console.log("...Calendar generated successfully!");
      resolve(mockApiResponse);
    }, 2000);
  });
};
// ---

// Thunk to finalize chat and get calendar data
export const finalizeChatAndGenerateCalendar = createAsyncThunk(
  "chat/generateCalendar",
  async (_, thunkAPI) => {
    // We use _ as we get data from the state
    const state = thunkAPI.getState() as RootState;
    const { messages } = state.chat;
    const { activeBrandId } = state.brand;

    if (!activeBrandId) {
      return thunkAPI.rejectWithValue("No active brand selected.");
    }

    const generatedData = await generateCalendarApi(messages, activeBrandId);
    return { brandId: activeBrandId, data: generatedData };
  }
);

interface ChatState {
  messages: { role: string; content: string }[];
  chatStarted: boolean;
  isGenerating: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  chatStarted: false,
  isGenerating: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    startChat: (state) => {
      state.chatStarted = true;
    },
    addUserMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: "user", content: action.payload });
    },
    addBotMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: "bot", content: action.payload });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(finalizeChatAndGenerateCalendar.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(finalizeChatAndGenerateCalendar.fulfilled, (state) => {
        state.isGenerating = false;
        // Optionally reset chat state here if needed
        // state.messages = [];
        // state.chatStarted = false;
      })
      .addCase(finalizeChatAndGenerateCalendar.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      });
  },
});

export const { startChat, addUserMessage, addBotMessage } = chatSlice.actions;
export default chatSlice.reducer;
