"use client";

import { useEffect, useMemo, useState } from "react";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import "./calendar-overview.css";
import {
  createCalendar,
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

interface CalendarViewProps {
  posts: Post[];
  timeline: CampaignTimeline;
  onPostSelect: (post: Post) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  timeline,
  onPostSelect,
}) => {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // ✅ Map posts → Schedule-X events
  const events = useMemo(
    () =>
      posts.map((post) => ({
        id: String(post.post_number),
        title: `${post.platform}: ${post.content_concept.title}`,
        start: Temporal.PlainDate.from(post.date), // e.g. 2025-09-22
        end: Temporal.PlainDate.from(post.date), // single-day events
        extendedProps: { post },
      })),
    [posts]
  );

  const calendar = useNextCalendarApp({
    views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
    defaultView: viewWeek.name,
    events,
    isDark: true,
    plugins: [eventsService],

    // Add this line to set the initial focused date
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
