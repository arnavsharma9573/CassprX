import React, { useState } from "react";
import { Message } from "@/types/common";
import { motion } from "framer-motion";
import {
  BarChart2,
  MessageSquare,
  Clipboard,
  Check,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface XResultCardProps {
  message: Message;
}

export const XResultCard = ({ message }: XResultCardProps) => {
  const variations = message.resultData as any[];
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!variations || variations.length === 0) {
    return <p className="text-red-400">No tweet variations were generated.</p>;
  }

  const activePost = variations[activeIndex];

  // ✅ Step 1: Check karo ki yeh ek interaction (reply/quote) hai ya naya tweet
  const isInteraction = activePost.interaction_type_used !== "standalone_tweet";
  const interactionTarget = activePost.suggested_reply_to;
  const sourceUrl = activePost.source_tweet_url;

  const handleCopy = () => {
    navigator.clipboard.writeText(activePost.text);
    setCopied(true);
    toast.success("Tweet content copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      {/* ✅ Step 2: Agar interaction hai, to ek special header dikhao */}
      {isInteraction && (
        <div className="flex items-center gap-2 mb-4 text-sm text-neutral-400 border-b border-neutral-800 pb-3">
          <MessageSquare size={16} />
          <span>
            Replying to{" "}
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:underline"
            >
              {interactionTarget}
            </a>
          </span>
          <ExternalLink className="w-4 h-4 ml-auto text-neutral-500 hover:text-white" />
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-4">
        {variations.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
              // ✅ Step 3: Blue color hata kar neutral color use karo
              activeIndex === index
                ? "bg-neutral-700 text-white"
                : "text-neutral-300 hover:bg-neutral-800"
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
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="font-bold text-xs">Tone:</span>
            <span className="capitalize">{activePost.tone_used}</span>
          </div>
        </div>

        {/* Full Text */}
        <p className="text-neutral-200 whitespace-pre-wrap text-sm leading-relaxed max-h-60 overflow-y-auto pr-2 bg-neutral-900/50 p-3 rounded-md border border-neutral-800">
          {activePost.text}
        </p>

        {/* Hashtags */}
        {activePost.hashtags_used && activePost.hashtags_used.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activePost.hashtags_used.map((tag: string) => (
              <span
                key={tag}
                className="bg-neutral-700/80 text-neutral-300 text-xs font-medium px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          // ✅ Step 4: Yahan se bhi blue color hatao
          className="w-full mt-4 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-green-600"
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
              <Clipboard className="w-5 h-5" /> Copy Tweet{" "}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
