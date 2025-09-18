import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/authSlice";
import brandReducer from "./feature/brandSlice";
import calendarReducer from "./feature/calendarSlice";
import chatReducer from "./feature/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    brand: brandReducer,
    calendar: calendarReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
