"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { selectAgent, Agent } from "@/store/feature/agentSlice"; // Make sure path is correct
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconHome,
  IconTerminal2,
  IconCalendar,
  IconSearch,
  IconEdit,
  IconChartBar,
  // ✨ 1. Import the missing icons
  IconUsers,
  IconSend,
  IconRecycle,
  IconPencil,
} from "@tabler/icons-react";

// ✨ 2. Add the missing icons to the map
const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
  home: IconHome,
  edit: IconEdit,
  search: IconSearch,
  users: IconUsers,
  send: IconSend,
  calendar: IconCalendar,
  recycle: IconRecycle,
  pencil: IconPencil,
  chart: IconChartBar,
  // "terminal" is no longer used, so it can be removed if you like
  terminal: IconTerminal2,
};

export function AgentDock() {
  const dispatch = useAppDispatch();

  const { availableAgents, selectedAgent } = useAppSelector(
    (state) => state.agent
  );

  const handleAgentSelect = (agent: Agent) => {
    dispatch(selectAgent(agent));
    console.log("Selected Agent:", agent.title);
  };

  const dockItems = availableAgents
    .map((agent) => {
      const isSelected = selectedAgent?.id === agent.id;
      const IconComponent = iconMap[agent.icon];

      // ✨ 3. (Recommended) Add a check to prevent crashes if an icon is ever missing
      if (!IconComponent) {
        console.warn(`Icon not found for agent: ${agent.title}`);
        return null; // Don't render a dock item if the icon doesn't exist
      }

      return {
        title: agent.title,
        href: "#",
        icon: (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAgentSelect(agent);
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <IconComponent
              className={`h-5 w-5 transition-colors duration-200 ${
                isSelected
                  ? "text-blue-500"
                  : "text-neutral-200 dark:text-neutral-400 group-hover:text-neutral-300"
              }`}
            />
          </button>
        ),
      };
    })
    .filter(Boolean) as {
    title: string;
    href: string;
    icon: React.ReactNode;
  }[]; // Filter out any null items from the check above

  return (
    <div className="flex items-center justify-center mb-2">
      <FloatingDock items={dockItems} />
    </div>
  );
}
