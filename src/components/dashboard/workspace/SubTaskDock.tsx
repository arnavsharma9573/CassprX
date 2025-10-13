"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  selectSubTask,
  ContentCreatorSubTask,
  selectActiveWorkflow,
} from "@/store/feature/workflowSlice";
import { FloatingDock } from "@/components/ui/floating-dock";
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
  icon: React.FC<{ className?: string }>;
}[] = [
  { label: "Carousel", mode: "CAROUSEL", icon: IconPhoto },
  { label: "Mascot", mode: "MASCOT", icon: IconMoodSmile },
  { label: "Meme", mode: "MEME", icon: IconMoodHappy },
  { label: "Playground UGC", mode: "UGC", icon: IconUsersGroup },
  { label: "Preset Mode", mode: "PRESET", icon: IconStack2 },
  { label: "Print Ads", mode: "PRINT_AD", icon: IconAd },
];

export function SubTaskDock() {
  const dispatch = useAppDispatch();
  const { activeSubTask } = useAppSelector(selectActiveWorkflow);

  const handleSelectMode = (mode: ContentCreatorSubTask) => {
    dispatch(selectSubTask(mode));
  };

  const dockItems = options.map((opt) => {
    const isSelected = activeSubTask === opt.mode;
    const isAnotherTaskActive = activeSubTask !== null && !isSelected;
    const IconComponent = opt.icon;

    return {
      title: opt.label,
      // Pass the click handler directly. If the item should be disabled, we pass undefined.
      onClick: isAnotherTaskActive
        ? undefined
        : () => handleSelectMode(opt.mode),
      // The icon is now ONLY the visual component, NOT a button.
      icon: (
        <IconComponent
          className={cn(
            "h-6 w-6 transition-colors duration-200",
            isSelected
              ? "text-blue-500" // Active style
              : "text-neutral-400",
            // The FloatingDock's button will handle the hover, but we can add disabled styles here.
            isAnotherTaskActive && "opacity-50"
          )}
        />
      ),
    };
  });

  return (
    <div className="flex items-center justify-center">
      <FloatingDock items={dockItems} />
    </div>
  );
}
