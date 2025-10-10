// src/components/MixpanelProvider.tsx
"use client";

import { useEffect } from "react";
import mixpanel from "@/lib/mixpanel";

export default function MixpanelProvider() {
  useEffect(() => {
    // Optional: track initial page view
    mixpanel.track("Page Load", { path: window.location.pathname });
  }, []);

  return null; // no UI needed
}
