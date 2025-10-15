"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  selectSubTask,
  CopywriterSubTask,
  selectActiveWorkflow,
} from "@/store/feature/workflowSlice";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconFileText,
  IconBrandLinkedin,
  IconBrandMedium,
  IconAt,
  IconBrandX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const options: {
  label: string;
  mode: CopywriterSubTask;
  icon: React.FC<{ className?: string }>;
}[] = [
  { label: "Blogger", mode: "BLOGGER", icon: IconFileText },
  { label: "LinkedIn", mode: "LINKEDIN", icon: IconBrandLinkedin },
  { label: "Medium", mode: "MEDIUM", icon: IconBrandMedium },
  { label: "Threads", mode: "THREADS", icon: IconAt },
  { label: "X", mode: "X", icon: IconBrandX },
];

export function CopywriterSubTaskDock() {
  const dispatch = useAppDispatch();
  const { activeSubTask } = useAppSelector(selectActiveWorkflow);

  const handleSelectMode = (mode: CopywriterSubTask) => {
    dispatch(selectSubTask(mode));
  };

  const dockItems = options.map((opt) => {
    const isSelected = activeSubTask === opt.mode;
    const isAnotherTaskActive = activeSubTask !== null && !isSelected;
    const IconComponent = opt.icon;

    return {
      title: opt.label,
      onClick: isAnotherTaskActive
        ? undefined
        : () => handleSelectMode(opt.mode),
      icon: (
        <IconComponent
          className={cn(
            "h-6 w-6 transition-colors duration-200",
            isSelected ? "text-blue-500" : "text-neutral-400",
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