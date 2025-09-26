import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CampaignData } from "@/types/calender";
import { campaignData as mockApiResponse } from "@/utils/mockApiResponse";
import { initialQuestionId, questionFlow } from "@/lib/questionDb";

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

// --- Updated Chat State Interface ---
interface ChatState {
  messages: { role: "user" | "bot"; content: string }[];
  isGenerating: boolean;
  error: string | null;
  currentQuestionId: string | null; // Tracks position in the conversation flow
}

// --- Updated Initial State ---
const initialState: ChatState = {
  messages: [],
  isGenerating: false,
  error: null,
  currentQuestionId: null, // Start with no question
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Initializes the chat with the first question
    initializeChat: (state) => {
      const firstQuestion = questionFlow[initialQuestionId];
      state.messages = [{ role: "bot", content: firstQuestion.text }];
      state.currentQuestionId = initialQuestionId;
      state.isGenerating = false;
      state.error = null;
    },
    addUserMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: "user", content: action.payload });
    },
    addBotMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: "bot", content: action.payload });
    },
    // Updates the current question ID to advance the conversation
    progressConversation: (state, action: PayloadAction<string>) => {
      state.currentQuestionId = action.payload;
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
        // Resetting chat state after successful generation can be done here
        // For example:
        // state.messages = [];
        // state.currentQuestionId = null;
      })
      .addCase(finalizeChatAndGenerateCalendar.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  initializeChat,
  addUserMessage,
  addBotMessage,
  progressConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
