"use client";
import Image from "next/image";
import React from "react";
import { Separator } from "../ui/separator";
import {
  BarChart3,
  Bell,
  ChartLine,
  FileText,
  LayoutDashboardIcon,
  MessageCircle,
  MessageCircleWarning,
  ServerCog,
  Settings,
  Sparkles,
  SparkleIcon,
} from "lucide-react";
import { Button } from "../ui/button";

export default function Sidebar() {
  const generalItems = [
    { name: "Dashboard", icon: LayoutDashboardIcon, link: "/dashboard" },
    { name: "Create Calender", icon: MessageCircle, link: "/dashboard/create-calender" },
    { name: "Notifications", icon: Bell, link: "/dashboard/notifications" },
  ];

  const toolsItems = [
    { name: "Brand Visibility", icon: BarChart3 },
    { name: "Competitors", icon: ServerCog },
    { name: "AI Traffic Analysis", icon: ChartLine },
    { name: "Automation", icon: Sparkles, version: "BETA" },
  ];

  const supportItems = [
    { name: "Settings", icon: Settings },
    { name: "Help Center", icon: FileText },
    { name: "Chat Support", icon: MessageCircleWarning },
  ];

  return (
    <div className="bg-neutral-900/80 h-full md:border-r border-neutral-800 shadow-sm flex flex-col justify-between md:rounded-xl">
      <div className="sidebar-header flex flex-col">
        <div className="flex items-center justify-center p-3">
          <Image
            src="/Logo.svg"
            width={100}
            height={110}
            alt="logo"
            className="rounded-lg"
          />
        </div>
        <Separator className="bg-neutral-800" />

        {/* General */}
        <div className="general p-3">
          <p className="text-[10px] text-neutral-500 font-semibold tracking-wide uppercase mb-3 pl-2">
            General
          </p>
          <div className="mt-1 space-y-1 ml-1">
            {generalItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 group hover:bg-neutral-800"
                onClick={() => {
                  window.location.href = item.link;
                }}
              >
                <item.icon className="size-4 text-neutral-400 group-hover:text-white" />
                <p className="font-medium text-neutral-300 group-hover:text-white text-xs">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-neutral-800" />

        {/* Tools */}
        <div className="tools p-3">
          <p className="text-[10px] text-neutral-500 font-semibold tracking-wide uppercase mb-3 pl-2">
            Tools
          </p>
          <div className="mt-1 space-y-1 ml-1">
            {toolsItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 group hover:bg-neutral-800"
              >
                <item.icon className="size-4 text-neutral-400 group-hover:text-white" />
                <p className="font-medium text-neutral-300 group-hover:text-white text-xs">
                  {item.name}
                </p>
                <div className="flex-1 flex justify-end">
                  {item.version && (
                    <span className="text-[10px] bg-indigo-900/40 text-indigo-400 px-2 py-0.5 rounded-sm font-semibold">
                      {item.version}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-neutral-800 mt-3" />

        {/* Support */}
        <div className="tools p-3">
          <p className="text-[10px] text-neutral-500 font-semibold tracking-wide uppercase mb-3 pl-2">
            Support
          </p>
          <div className="mt-1 space-y-1 ml-1">
            {supportItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 group hover:bg-neutral-800"
              >
                <item.icon className="size-4 text-neutral-400 group-hover:text-white" />
                <p className="font-medium text-neutral-300 group-hover:text-white text-xs">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer p-2 w-full relative">
        <div className="relative flex justify-center">
          <Button
            variant="sidebar"
            className="z-10 relative bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Upgrade
          </Button>

          {/* Current Plan Badge */}
          <div className="absolute bottom-9 w-[100%] h-10 rounded-t-md bg-indigo-900/30 border border-indigo-800 flex items-center justify-center">
            <div className="flex items-center space-x-1">
              <SparkleIcon className="size-4 text-indigo-400" />
              <p className="text-xs text-indigo-400 font-medium">
                Current plan:
              </p>
              <p className="text-xs font-semibold text-indigo-300">Free Tier</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
