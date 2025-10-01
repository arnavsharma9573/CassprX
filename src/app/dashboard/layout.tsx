"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  return (
    <div className="h-screen flex bg-[#020201]">
      <div
        className={`hidden md:block border-r border-neutral-800 bg-neutral-900/80 overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed ? "w-14" : "w-54"
        }`}
      >
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((v) => !v)} />
      </div>
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {/* <DashboardHeader /> */}
        <main className="flex-1 overflow-y-auto" style={{scrollbarWidth:"none"}}>
          {children}
        </main>
      </div>
    </div>
  );
}
