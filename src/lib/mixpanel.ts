// /lib/mixpanel.ts
import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN =
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "1c17978bb4a0ad3721ab04d11e9fb5be";

let initialized = false;

export const initMixpanel = () => {
  if (typeof window === "undefined" || initialized) return;

  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: true,
      record_sessions_percent: 100,
      debug: process.env.NODE_ENV === "development",
    });
    initialized = true;
    console.log("✅ Mixpanel initialized");
  } catch (err) {
    console.error("❌ Mixpanel initialization failed:", err);
  }
};

export default mixpanel;
