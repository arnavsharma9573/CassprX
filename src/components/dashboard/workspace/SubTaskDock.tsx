"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  selectSubTask,
  ContentCreatorSubTask,
  selectActiveWorkflow,
} from "@/store/feature/workflowSlice";
import { VerticalFloatingDock } from "@/components/ui/VerticalFloatingDock";
import {
  IconPhoto,
  IconMoodSmile,
  IconMoodHappy,
  IconUsersGroup,
  IconStack2,
  IconAd,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const options: {
  label: string;
  mode: ContentCreatorSubTask;
  icon: React.ReactNode;
}[] = [
  { label: "Carousel", mode: "CAROUSEL", icon: <IconPhoto /> },
  { label: "Mascot", mode: "MASCOT", icon: <IconMoodSmile /> },
  { label: "Meme", mode: "MEME", icon: <IconMoodHappy /> },
  { label: "Playground UGC", mode: "UGC", icon: <IconUsersGroup /> },
  { label: "Preset Mode", mode: "PRESET", icon: <IconStack2 /> },
  { label: "Print Ads", mode: "PRINT_AD", icon: <IconAd /> },
];

export function SubTaskDock() {
  const dispatch = useAppDispatch();
  const { activeSubTask } = useAppSelector(selectActiveWorkflow);

  const handleSelectMode = (mode: ContentCreatorSubTask) => {
    dispatch(selectSubTask(mode));
  };

  const dockItems = options.map((opt) => {
    const isAnotherTaskActive =
      activeSubTask !== null && activeSubTask !== opt.mode;

    return {
      title: opt.label,
      icon: (
        <button
          onClick={() => handleSelectMode(opt.mode)}
          // Add the disabled attribute based on the condition
          disabled={isAnotherTaskActive}
          className={cn(
            "w-full h-full flex items-center justify-center group transition-colors",
            opt.mode === activeSubTask
              ? "text-blue-500" // Active style
              : "text-neutral-400 hover:text-neutral-100",
            // Add styles for the disabled state
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-neutral-400"
          )}
        >
          {opt.icon}
        </button>
      ),
    };
  });

  return (
    <div className="z-50">
      <VerticalFloatingDock items={dockItems} />
    </div>
  );
}
