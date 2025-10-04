// store/feature/chatSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CampaignPlan, AIRecommendations } from "@/types/calender";

interface ChatState {
  messages: { role: string; content: string }[];
  chatStarted: boolean;
  campaignPlan: CampaignPlan | null;
  showCampaignCard: boolean;
  aiRecommendations: AIRecommendations | null;
  showAIRecommendationsCard: boolean;
  confirmedCampaignId: string | null;
  finalized: boolean;
  calendarJobId: string | null;
  isCreatingCalendar: boolean;
  // New loading states
  isTyping: boolean; // For bot typing indicator
  loadingStage:
    | "idle"
    | "creating_campaign"
    | "confirming_campaign"
    | "fetching_recommendations"
    | "finalizing_campaign"
    | "creating_calendar"
    | "polling_calendar"
    | null;
  calendarProgress: number; // 0-100 for progress tracking
}

const initialState: ChatState = {
  messages: [],
  chatStarted: false,
  campaignPlan: null,
  showCampaignCard: false,
  aiRecommendations: null,
  showAIRecommendationsCard: false,
  confirmedCampaignId: null,
  finalized: false,
  calendarJobId: null,
  isCreatingCalendar: false,
  isTyping: false,
  loadingStage: null,
  calendarProgress: 0,
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
      state.isTyping = false; // Stop typing when message is added
    },
    setCampaignPlan: (state, action: PayloadAction<CampaignPlan>) => {
      state.campaignPlan = action.payload;
      state.showCampaignCard = true;
    },
    hideCampaignCard: (state) => {
      state.showCampaignCard = false;
    },
    clearCampaignPlan: (state) => {
      state.campaignPlan = null;
      state.showCampaignCard = false;
    },
    setConfirmedCampaignId: (state, action: PayloadAction<string>) => {
      state.confirmedCampaignId = action.payload;
    },
    setAIRecommendations: (state, action: PayloadAction<AIRecommendations>) => {
      state.aiRecommendations = action.payload;
      state.showAIRecommendationsCard = true;
    },
    hideAIRecommendationsCard: (state) => {
      state.showAIRecommendationsCard = false;
    },
    setFinalized: (state, action: PayloadAction<boolean>) => {
      state.finalized = action.payload;
    },
    setCalendarJobId: (state, action: PayloadAction<string>) => {
      state.calendarJobId = action.payload;
    },
    setIsCreatingCalendar: (state, action: PayloadAction<boolean>) => {
      state.isCreatingCalendar = action.payload;
    },
    // New actions for loading states
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setLoadingStage: (
      state,
      action: PayloadAction<ChatState["loadingStage"]>
    ) => {
      state.loadingStage = action.payload;
    },
    setCalendarProgress: (state, action: PayloadAction<number>) => {
      state.calendarProgress = action.payload;
    },
    resetChat: (state) => {
      return initialState;
    },
  },
});

export const {
  startChat,
  addUserMessage,
  addBotMessage,
  setCampaignPlan,
  hideCampaignCard,
  clearCampaignPlan,
  setConfirmedCampaignId,
  setAIRecommendations,
  hideAIRecommendationsCard,
  setFinalized,
  setCalendarJobId,
  setIsCreatingCalendar,
  setIsTyping,
  setLoadingStage,
  setCalendarProgress,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
