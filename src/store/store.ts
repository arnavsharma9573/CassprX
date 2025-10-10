// store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./feature/authSlice";
import brandReducer from "./feature/brandSlice";
import calendarReducer from "./feature/calendarSlice";
import chatReducer from "./feature/chatSlice";
import agentReducer from "./feature/agentSlice";
import workflowReducer from "./feature/workflowSlice";
import { createPersistStorage } from "./persistStorage";

const storage = createPersistStorage();

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  brand: brandReducer,
  calendar: calendarReducer,
  chat: chatReducer,
  agent: agentReducer,
  workflow:workflowReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE","workflow/submitStep"],
        ignoredPaths: [
            "workflow.taskData.logo_file",
            "workflow.taskData.mascot_file",
            "workflow.taskData.product_file",
            "workflow.taskData.base_image",
            "workflow.taskData.brand_guidelines_file",
            "workflow.taskData.source_image",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
