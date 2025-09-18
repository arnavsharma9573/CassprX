"use client";

import ChatInterface from "@/components/dashboard/create-calendar/ChatInterface";
import { useState } from "react";

export default function CreateCalendarPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  return (
    <div className="space-y-4">
      <ChatInterface/>
    </div>
  );
}
 