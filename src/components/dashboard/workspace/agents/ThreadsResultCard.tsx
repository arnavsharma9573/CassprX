import React, { useState } from "react";
import { Message } from "@/types/common";
import { motion } from "framer-motion";
import {
  BarChart2,
  Hash,
  MessageSquare,
  Bookmark,
  Clipboard,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ThreadsResultCardProps {
  message: Message;
}

export const ThreadsResultCard = ({ message }: ThreadsResultCardProps) => {
  const variations = message.resultData as any[];
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!variations || variations.length === 0) {
    return <p className="text-red-400">No post variations were generated.</p>;
  }

  const activePost = variations[activeIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activePost.text); // API response mein 'text' key hai
    setCopied(true);
    toast.success("Post content copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-4 border-b border-neutral-700 pb-2">
        {variations.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeIndex === index
                ? "bg-blue-600 text-white"
                : "text-neutral-300 hover:bg-neutral-700"
            )}
          >
            Option {index + 1}
          </button>
        ))}
      </div>

      {/* Post Content */}
      <div className="space-y-4">
        {/* Stats Section */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5 text-yellow-400">
            <BarChart2 className="w-4 h-4" />
            <span className="font-semibold">
              Score: {activePost.engagement_score}
            </span>
          </div>
          <div
            className={`flex items-center gap-1.5 ${
              activePost.conversation_potential
                ? "text-green-400"
                : "text-neutral-500"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Conversation</span>
          </div>
          <div
            className={`flex items-center gap-1.5 ${
              activePost.saves_potential ? "text-green-400" : "text-neutral-500"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saves</span>
          </div>
        </div>

        {/* Full Text */}
        <p className="text-neutral-200 whitespace-pre-wrap text-sm leading-relaxed max-h-60 overflow-y-auto pr-2">
          {activePost.text}
        </p>

        {/* Hashtags */}
        {activePost.hashtags_used && activePost.hashtags_used.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activePost.hashtags_used.map((tag: string) => (
              <span
                key={tag}
                className="bg-neutral-700 text-neutral-200 text-xs font-medium px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-green-600"
          disabled={copied}
        >
          {copied ? (
            <>
              {" "}
              <Check className="w-5 h-5" /> Copied!{" "}
            </>
          ) : (
            <>
              {" "}
              <Clipboard className="w-5 h-5" /> Copy Post{" "}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
