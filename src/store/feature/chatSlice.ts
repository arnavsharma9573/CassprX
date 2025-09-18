import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatState {
  messages: Message[];
  chatStarted: boolean;
}

const initialState: ChatState = {
  messages: [],
  chatStarted: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    startChat: (state) => {
      state.chatStarted = true;
    },
    addUserMessage: (state, action: PayloadAction<string>) => {
      if (!action.payload.trim()) return;
      state.messages.push({ role: "user", content: action.payload });
    },
    addBotMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: "assistant", content: action.payload });
    },
    resetChat: (state) => {
      state.messages = [];
      state.chatStarted = false;
    },
  },
});

export const { startChat, addUserMessage, addBotMessage, resetChat } =
  chatSlice.actions;

export const submitChatMessage = (message: string) => (dispatch: any) => {
  // Add user message
  dispatch(addUserMessage(message));

  // Simulate bot response
  setTimeout(() => {
    dispatch(addBotMessage("Got it. Processing your request..."));
  }, 1200);
};

export default chatSlice.reducer;
