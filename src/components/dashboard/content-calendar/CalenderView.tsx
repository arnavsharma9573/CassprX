import React, { useState } from "react";
import PlatformIcon from "./PlatformIcon";
import { CampaignTimeline, Post } from "@/types/calender";
import { format, startOfWeek, addDays, isSameMonth, isToday } from "date-fns";

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
  const startDate = new Date(timeline.start_date);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");

  // Generate weeks based on the campaign duration
  const weeks = Array.from(
    { length: timeline.duration_weeks },
    (_, weekIndex) => {
      const weekStartDate = addDays(startDate, weekIndex * 7);
      const weekDays = Array.from({ length: 7 }, (_, dayIndex) => {
        const date = addDays(weekStartDate, dayIndex);
        const dateStr = format(date, "yyyy-MM-dd");
        return {
          date,
          dateStr,
          posts: posts.filter((post) => post.date === dateStr),
        };
      });

      return {
        weekNumber: weekIndex + 1,
        theme: timeline.weekly_themes[weekIndex] || `Week ${weekIndex + 1}`,
        days: weekDays,
      };
    }
  );

  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-8">
      {weeks.map((week) => (
        <div
          key={week.weekNumber}
          className="bg-neutral-900 rounded-xl border border-neutral-800"
        >
          {/* Week Header */}
          <div className="p-4 border-b border-neutral-800">
            <h3 className="font-semibold text-lg text-white">
              Week {week.weekNumber}: {week.theme}
            </h3>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px">
            {/* Day Headers */}
            {dayHeaders.map((dayName) => (
              <div
                key={dayName}
                className="p-3 text-center text-xs font-medium text-neutral-400 border-r border-b border-neutral-800"
              >
                {dayName}
              </div>
            ))}

            {/* Day Cells */}
            {week.days.map((day, dayIndex) => (
              <div
                key={day.dateStr}
                className={`p-2 min-h-[130px] border-b border-r border-neutral-800 ${
                  isToday(day.date) ? "bg-blue-900/30" : "bg-transparent"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isToday(day.date) ? "text-blue-300" : "text-neutral-200"
                  }`}
                >
                  {format(day.date, "d")}
                </span>
                <div className="mt-1 space-y-1">
                  {day.posts.map((post) => (
                    <div
                      key={post.post_number}
                      className="p-1.5 rounded-md cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200"
                      onClick={() => onPostSelect(post)}
                    >
                      <div className="flex items-center space-x-1.5">
                        <PlatformIcon platform={post.platform} />
                        <span className="text-xs text-neutral-300 truncate">
                          {post.content_concept.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarView;
