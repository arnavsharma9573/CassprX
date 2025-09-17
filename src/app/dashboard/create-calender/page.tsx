"use client"
import { useRouter } from "next/navigation";
import React from "react";

export default function CreateCalenderPage() {
  const router = useRouter();
  return (
    <div onClick={() => router.push("/dashboard/content-calendar")}>Create</div>
  );
}
