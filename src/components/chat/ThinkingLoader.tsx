// components/chat/ThinkingLoader.tsx

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface ThinkingLoaderProps {
  stage?:
    | "creating_campaign"
    | "confirming_campaign"
    | "fetching_recommendations"
    | "finalizing_campaign";
}

const thinkingMessages = {
  creating_campaign: [
    "Thinking...",
    "Analyzing your campaign idea...",
    "Understanding your target audience...",
    "Crafting your strategy...",
    "Building campaign structure...",
    "Defining objectives...",
    "Planning content themes...",
  ],
  confirming_campaign: [
    "Thinking...",
    "Confirming your campaign plan...",
    "Validating campaign details...",
    "Setting up campaign framework...",
    "Preparing next steps...",
  ],
  fetching_recommendations: [
    "Thinking...",
    "Analyzing market trends...",
    "Evaluating platform performance...",
    "Generating AI recommendations...",
    "Optimizing platform strategy...",
    "Calculating best posting times...",
    "Assessing audience engagement patterns...",
  ],
  finalizing_campaign: [
    "Thinking...",
    "Finalizing your selections...",
    "Processing platform choices...",
    "Preparing campaign details...",
    "Setting up content calendar parameters...",
  ],
};

export default function ThinkingLoader({
  stage = "creating_campaign",
}: ThinkingLoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messages = thinkingMessages[stage];

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [messages.length, stage]);

  useEffect(() => {
    setCurrentMessageIndex(0);
  }, [stage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
    >
      {/* ▼▼▼ THE FIX IS HERE ▼▼▼ */}
      <div
        className="relative max-w-[75%] sm:max-w-[65%] lg:max-w-[55%] rounded-2xl rounded-bl-md px-5 py-4 overflow-hidden 
                   bg-gradient-to-r from-neutral-800 to-neutral-700 border border-neutral-600/30"
      >
        {/* Animated gradient shimmer background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-600/50 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Text content with fade transition */}
        <div className="relative z-10 min-h-[20px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-sm text-white/90 font-medium flex items-center"
            >
              {messages[currentMessageIndex]}
              {messages[currentMessageIndex] === "Thinking..." && (
                <span className="ml-1 flex space-x-0.5">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  >
                    .
                  </motion.span>
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
