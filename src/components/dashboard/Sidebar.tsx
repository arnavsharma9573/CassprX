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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const generalItems = [
    { name: "Dashboard", icon: LayoutDashboardIcon, link: "/dashboard" },
    {
      name: "Create Calendar",
      icon: MessageCircle,
      link: "/dashboard/create-calender",
    },
    { name: "Calendar", icon: Bell, link: "/dashboard/content-calendar" },
  ];

  const toolsItems = [
    {
      name: "Brand Visibility",
      icon: BarChart3,
      link: "/dashboard/brand-visibility",
    },
    { name: "Competitors", icon: ServerCog, link: "/dashboard/competitors" },
    {
      name: "AI Traffic Analysis",
      icon: ChartLine,
      link: "/dashboard/ai-traffic-analysis",
    },
    {
      name: "Automation",
      icon: Sparkles,
      version: "BETA",
      link: "/dashboard/automation",
    },
  ];

  const supportItems = [
    { name: "Settings", icon: Settings, link: "/dashboard/settings" },
    { name: "Help Center", icon: FileText, link: "/dashboard/help-center" },
    {
      name: "Chat Support",
      icon: MessageCircleWarning,
      link: "/dashboard/chat-support",
    },
  ];

  return (
    <div className="bg-neutral-900/80 h-full md:border-r border-neutral-800 shadow-sm flex flex-col justify-between">
      <div className="sidebar-header flex flex-col">
        <div className="flex items-center justify-center p-3 ">
          <Link href={"/"}>
            <Image
              src="/Logo.svg"
              width={100}
              height={110}
              alt="logo"
              className="rounded-lg"
            />
          </Link>
        </div>
        <Separator className="bg-neutral-800" />

        {/* General */}
        <div className="general p-3">
          <p className="text-[11px] text-[var(--primary2)] tracking-wide uppercase mb-3 pl-2">
            General
          </p>
          <div className="mt-1 space-y-1 ml-1">
            {generalItems.map((item, index) => {
              const isActive = pathname === item.link;
              return (
                <div
                  key={index}
                  className={`w-full space-x-3 flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? "bg-yellow-500/10 text-yellow-500 border-r-2 border-yellow-500"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => router.push(item.link)}
                >
                  <item.icon className="size-4 text-neutral-300 group-hover:text-white" />
                  <p className="font-medium text-neutral-300 group-hover:text-white ">
                    {item.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="bg-neutral-800" />

        {/* Tools */}
        <div className="tools p-3">
          <p className="text-[11px] text-[var(--primary2)] tracking-wide uppercase mb-3 pl-2">
            AGENTS
          </p>
          <div className="mt-1 space-y-1 ml-1">
            {toolsItems.map((item, index) => {
              const isActive = pathname === item.link;
              return (
                <div
                  key={index}
                  className={`w-full space-x-3 flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? "bg-yellow-500/10 text-yellow-500 border-r-2 border-yellow-500"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => router.push(item.link)}
                >
                  <item.icon className="size-4 text-neutral-300 group-hover:text-white" />
                  <p className="font-medium text-neutral-300 group-hover:text-white">
                    {item.name}
                  </p>
                  <div className="flex-1 flex justify-end">
                    {item.version && (
                      <span className="text-[10px] bg-[#eac565] text-black px-2 py-0.5 rounded-sm">
                        {item.version}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="bg-neutral-800 mt-3" />

        {/* Support */}
        <div className="tools p-3">
          <p className="text-[11px] text-[var(--primary2)] tracking-wide uppercase mb-3 pl-2">
            Support
          </p>
          <div className="mt-1 space-y-1 ml-1">
            {supportItems.map((item, index) => {
              const isActive = pathname === item.link;
              return (
                <div
                  key={index}
                  className={`w-full space-x-3 flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group cursor-pointer ${
                    isActive
                      ? "bg-yellow-500/10 text-yellow-500 border-r-2 border-yellow-500"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => router.push(item.link)}
                >
                  <item.icon className="size-4 text-neutral-300 group-hover:text-white" />
                  <p className="font-medium text-neutral-300 group-hover:text-white">
                    {item.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer p-2 w-full relative">
        <div className="relative flex justify-center">
          <Button
            variant="sidebar"
            className="z-10 relative border-amber-300 bg-[var(--primary2)] text-neutral-800"
          >
            Upgrade
          </Button>

          {/* Current Plan Badge */}
          <div className="absolute bottom-9 w-[100%] h-10 rounded-t-md  border border-[var(--primary2)] flex items-center justify-center">
            <div className="flex items-center space-x-1">
              <SparkleIcon className="size-4 text-white" />
              <p className="text-xs text-white font-medium">Current plan:</p>
              <p className="text-xs font-semibold text-white">Free Tier</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
