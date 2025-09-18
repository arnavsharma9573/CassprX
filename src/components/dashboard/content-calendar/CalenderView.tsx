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

function CustomMonthDate({ date, jsDate }: { date: number; jsDate: Date }) {
  const minDate = new Date("2025-09-22");
  const maxDate = new Date("2025-10-20");

  const isDisabled = jsDate < minDate || jsDate > maxDate;

  return (
    <div
      className={`flex items-center justify-center w-full h-full rounded-md 
        ${
          isDisabled
            ? "text-gray-600 bg-neutral-900/50 cursor-not-allowed"
            : "text-white"
        }
      `}
    >
      {date}
    </div>
  );
}

function CustomWeekDate({ date }: { date: Date }) {
  const minDate = new Date("2025-09-22");
  const maxDate = new Date("2025-10-20");

  const isDisabled = date < minDate || date > maxDate;

  return (
    <div
      className={`px-2 py-1 rounded-md text-sm 
        ${isDisabled ? "text-gray-600 bg-neutral-900/50" : "text-white"}
      `}
    >
      {date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
    </div>
  );
}

function CustomEventModal({ calendarEvent }: { calendarEvent: any }) {
  return (
    <div className="p-4 bg-neutral-900 text-white rounded-xl shadow-lg border border-neutral-700">
      <h2 className="text-lg font-semibold">{calendarEvent.title}</h2>
      <p className="text-sm text-gray-400">
        {new Date(calendarEvent.start).toDateString()}
      </p>
    </div>
  );
}
