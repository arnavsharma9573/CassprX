"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import React, { useEffect } from "react";
import { fetchUserBrands } from "@/store/thunks/brandThunks";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { RootState } from "@/store/store";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const { brands, loading } = useAppSelector((state: RootState) => state.brand);

  useEffect(() => {
    if (isAuthenticated && brands.length <= 1 && !loading) {
      console.log("🔄 Fetching user brands globally on dashboard load...");
      dispatch(fetchUserBrands());
    }
  }, [isAuthenticated]);

  return (
    <div className="h-screen flex bg-[#020201]">
      <div
        className={`hidden md:block border-r border-neutral-800 bg-neutral-900/80 overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed ? "w-14" : "w-54"
        }`}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((v) => !v)}
        />
      </div>
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {/* <DashboardHeader /> */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
