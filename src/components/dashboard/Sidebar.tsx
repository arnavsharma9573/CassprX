"use client";
import Image from "next/image";
import React from "react";
import { Separator } from "../ui/separator";
import {
  BarChart3,
  ChartLine,
  FileText,
  LayoutDashboardIcon,
  MessageCircle,
  ServerCog,
  Settings,
  Sparkles,
  CalendarDays, // Corrected icon name
  ChevronLeft, // Icon for collapsing
  ChevronRight,
  Menu, // Icon for expanding
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/redux-hooks";
import UserCard from "./UserCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"; // Assuming you have a Tooltip component

type SidebarProps = {
  isCollapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeBrandId } = useAppSelector((state) => state.brand);

  const generalItems = [
    { name: "Dashboard", icon: LayoutDashboardIcon, link: "/dashboard" },
    {
      name: "Create Calendar",
      icon: MessageCircle,
      link: `/dashboard/${activeBrandId}/create-calendar`,
    },
    {
      name: "Content Calendar",
      icon: CalendarDays, // Corrected Icon
      link: `/dashboard/${activeBrandId}/content-calendar`,
    },
  ];

  const toolsItems = [
    {
      name: "Agent Workspace",
      icon: Sparkles,
      link: "/dashboard/workspace",
    },
    {
      name: "Brand Profiles",
      icon: LayoutDashboardIcon,
      link: "/dashboard/brand-profiles",
    },
    {
      name: "Agents Library",
      icon: ServerCog,
      link: "/dashboard/agents-library",
    },
    {
      name: "Media Gallery",
      icon: FileText,
      link: "/dashboard/media-gallery",
    },
  ];

  const supportItems = [
    { name: "Settings", icon: Settings, link: "/dashboard/profile" },
    { name: "Help Center", icon: FileText, link: "/dashboard/faq" },
  ];

  const renderSidebarItem = (item: any, isActive: boolean) => (
    <div
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group cursor-pointer ${
        isActive
          ? "text-white border-2 border-[#eac565]/40"
          : "text-gray-300 hover:bg-neutral-800 hover:text-white"
      } ${isCollapsed ? "justify-center" : "space-x-3"}`}
      onClick={() => router.push(item.link)}
    >
      <item.icon className="size-4 shrink-0" />
      {!isCollapsed && (
        <p className="font-medium whitespace-nowrap overflow-hidden">
          {item.name}
        </p>
      )}
      {!isCollapsed && item.version && (
        <div className="flex-1 flex justify-end">
          <span className="text-[10px] bg-[#eac565] text-black px-2 py-0.5 rounded-sm">
            {item.version}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={
        "flex h-full flex-col justify-between shadow-sm transition-all duration-500 ease-in-out bg-black"
      }
    >
      <div>
        <div className="sidebar-header flex flex-col">
          <div className="flex items-center justify-between p-2 h-[56px]">
            {!isCollapsed && (
              <Link href={"/"}>
                <Image
                  src="/Logo.svg"
                  width={150}
                  height={60}
                  alt="logo"
                  className="rounded-lg"
                />
              </Link>
            )}

            <button
              onClick={onToggle}
              className="text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md transition-colors p-2"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu size={18} />
            </button>
          </div>

          <Separator className="bg-neutral-800" />

          <TooltipProvider delayDuration={0}>
            {/* General */}
            <div className="general p-3">
              {!isCollapsed && (
                <p className="text-[12px] text-white font-semibold tracking-wide uppercase mb-3 pl-2">
                  General
                </p>
              )}
              <div className="mt-1 space-y-1">
                {generalItems.map((item, index) => {
                  const isActive = pathname === item.link;
                  return isCollapsed ? (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        {renderSidebarItem(item, isActive)}
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.name}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={index}>{renderSidebarItem(item, isActive)}</div>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            {/* Tools */}
            <div className="tools p-3">
              {!isCollapsed && (
                <p className="text-[12px] text-white font-semibold tracking-wide uppercase mb-3 pl-2">
                  AGENTS
                </p>
              )}
              <div className="mt-1 space-y-1">
                {toolsItems.map((item, index) => {
                  const isActive = pathname === item.link;
                  return isCollapsed ? (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        {renderSidebarItem(item, isActive)}
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.name}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={index}>{renderSidebarItem(item, isActive)}</div>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-neutral-800 mt-3" />

            {/* Support */}
            <div className="tools p-3">
              {!isCollapsed && (
                <p className="text-[12px] text-white font-semibold tracking-wide uppercase mb-3 pl-2">
                  Support
                </p>
              )}
              <div className="mt-1 space-y-1">
                {supportItems.map((item, index) => {
                  const isActive = pathname === item.link;
                  return isCollapsed ? (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        {renderSidebarItem(item, isActive)}
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.name}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={index}>{renderSidebarItem(item, isActive)}</div>
                  );
                })}
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer flex flex-col border-t border-neutral-800">
        <div className="p-3">
          <UserCard isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
}
