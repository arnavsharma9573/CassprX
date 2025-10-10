// /lib/mixpanel.ts
import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "1c17978bb4a0ad3721ab04d11e9fb5be";

// Initialize Mixpanel once
mixpanel.init(MIXPANEL_TOKEN, {
  autocapture: true,            // Auto capture clicks, pageviews, etc.
  record_sessions_percent: 100, // Optional: record full sessions
  debug: process.env.NODE_ENV === "development",
});

// Export the instance to use anywhere
export default mixpanel;
