export const platformColors: Record<string, string> = {
  LinkedIn: "text-blue-300",
  Instagram: "bg-gradient-to-r from-[#fcb045] via-[#fd1d1d] to-[#833ab4] inline-block text-transparent bg-clip-text",
  Facebook: "text-sky-500",
  Twitter: "text-gray-400",
  YouTube: "text-red-600",
  TikTok: "text-gray-900",
  Default: "text-white/50"
};

export const platformIcons: Record<string, string> = {
  Instagram: "/instagram.svg",
  LinkedIn: "/linkedin.svg",
  Facebook: "/facebook.svg",
  Twitter: "/twitter.svg",
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
