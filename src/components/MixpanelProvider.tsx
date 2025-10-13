"use client";

import { useEffect } from "react";
import mixpanel, { initMixpanel } from "@/lib/mixpanel";

export default function MixpanelProvider() {
  useEffect(() => {
    // Initialize only once on client
    initMixpanel();

    // Safety check
    if (!mixpanel || typeof mixpanel.track !== "function") {
      console.warn("⚠️ Mixpanel not initialized — skipping tracking");
      return;
    }

    try {
      const root = localStorage.getItem("persist:root");
      if (root) {
        const auth = JSON.parse(JSON.parse(root).auth);
        const user = auth?.user;
        if (user?.id) {
          mixpanel.identify(user.id);
          mixpanel.people.set({
            $name: user.name,
            $email: user.email,
          });
        }
      }

      mixpanel.track("Page Load", { path: window.location.pathname });
    } catch (err) {
      console.error("MixpanelProvider error:", err);
    }
  }, []);

  return null;
}
