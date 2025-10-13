"use client";

import { useMemo, useState } from "react";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import "./calendar-overview.css";
import {
  viewDay,
  viewWeek,
  viewMonthGrid,
  viewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";

import { CampaignTimeline, Post } from "@/types/calender";
import PostDetailModal from "./PostDetailModal";
import { getPlatformName } from "@/lib/helper";

interface CalendarViewProps {
  posts: Post[];
  timeline: CampaignTimeline;
  onPostSelect: (post: Post) => void;
}

// Define platform color mapping
const platformColorMap: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#BD328E",
  twitter: "#18181b",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
};

const getPlatformColor = (platform: string): string => {
  const normalizedPlatform = getPlatformName(platform).toLowerCase();
  return platformColorMap[normalizedPlatform] || "#6366F1"; // Default to indigo if platform not found
};

// Function to get normalized platform key for calendarId
const getNormalizedPlatformKey = (platform: string): string => {
  return getPlatformName(platform).toLowerCase();
};

const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  timeline,
  onPostSelect,
}) => {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // ✅ Map posts → Schedule-X events with platform colors
  const events = useMemo(
    () =>
      posts.map((post) => {
        const normalizedPlatform = getNormalizedPlatformKey(post.platform);
        return {
          id: String(post.post_number),
          title: `${getPlatformName(post.platform)}: ${
            post.content_concept.title
          }`,
          start: Temporal.PlainDate.from(post.date),
          end: Temporal.PlainDate.from(post.date),
          // Use normalized platform name as calendarId
          calendarId: normalizedPlatform,
          extendedProps: { post },
        };
      }),
    [posts]
  );

  // Create calendars configuration for each platform
  const calendars = useMemo(() => {
    const uniquePlatforms = Array.from(
      new Set(posts.map((post) => getNormalizedPlatformKey(post.platform)))
    );

    return Object.fromEntries(
      uniquePlatforms.map((platform) => {
        const color = getPlatformColor(platform);
        return [
          platform,
          {
            colorName: platform,
            lightColors: {
              main: color,
              container: `${color}`,
              onContainer: color,
            },
            darkColors: {
              main: color,
              container: `${color}`,
              onContainer: color,
            },
          },
        ];
      })
    );
  }, [posts]);

  const calendar = useNextCalendarApp({
    views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
    defaultView: viewWeek.name,
    events,
    calendars, // Add the calendars configuration
    isDark: true,
    plugins: [eventsService],
    selectedDate: Temporal.PlainDate.from(timeline.start_date),
    minDate: Temporal.PlainDate.from(timeline.start_date),
    maxDate: Temporal.PlainDate.from(timeline.end_date),
    callbacks: {
      onEventClick: (event) => {
        if (event.extendedProps?.post)
          setSelectedPost(event.extendedProps.post as Post);
      },
    },
  });

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <h3 className="font-semibold text-lg text-white mb-4">
        Campaign Calendar ({timeline.start_date} → {timeline.end_date})
      </h3>
      <ScheduleXCalendar calendarApp={calendar} />
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;
