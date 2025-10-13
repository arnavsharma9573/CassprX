"use client";
import MixpanelProvider from "@/components/MixpanelProvider";
import { Toaster } from "@/components/ui/sonner";
import { persistor, store } from "@/store/store";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <MixpanelProvider/>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster />
      </PersistGate>
    </Provider>
  );
}
