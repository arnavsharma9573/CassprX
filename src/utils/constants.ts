import { PlatformIcons } from "@/types/calender";
import { Instagram, Youtube, Facebook } from "lucide-react";

export const platformColors: Record<string, string> = {
  Instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  Facebook: "bg-blue-600",
  YouTube: "bg-red-600",
  TikTok: "bg-gray-900",
};

export const platformIcons: PlatformIcons = {
  Instagram: Instagram,
  Facebook: Facebook,
  YouTube: Youtube,
};

export const pillarColors: Record<string, string> = {
  Educational: "bg-blue-900/30 text-blue-300 border-blue-500/50",
  Inspirational: "bg-green-900/30 text-green-300 border-green-500/50",
  Community: "bg-purple-900/30 text-purple-300 border-purple-500/50",
  Entertainment: "bg-yellow-900/30 text-yellow-300 border-yellow-500/50",
  "Behind-the-Scenes": "bg-neutral-800/50 text-gray-300 border-gray-500/50",
};

export const effortLevelColors: Record<string, string> = {
  LOW: "bg-green-900/30 text-green-300",
  MEDIUM: "bg-yellow-900/30 text-yellow-300",
  HIGH: "bg-red-900/30 text-red-300",
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const placeholders = [
  "What's your next campaign idea?",
  "Who is your target audience today?",
  "Where should your brand go next?",
  "Write a catchy caption for Instagram",
  "How to plan a full campaign in minutes?",
];
