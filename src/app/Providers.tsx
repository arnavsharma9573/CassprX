"use client"
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/store/store";
import React from "react";
import { Provider } from "react-redux";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
}
