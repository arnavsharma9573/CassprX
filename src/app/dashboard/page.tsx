"use client"
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { increment } from "@/store/feature/counterSlice";
import React from "react";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  return (
    <div className="p-2">
      
    </div>
  );
}
