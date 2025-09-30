"use client";

import { motion, Variants } from "framer-motion";
import { Send, Bot, User } from "lucide-react";

type ChatMessage = {
  sender: "user" | "agent";
  message: string;
  timestamp?: string;
};

interface ChatMockupProps {
  messages: ChatMessage[];
  agentName?: string;
}

// Parent container variants to orchestrate animations
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};

// Child message variants
const messageVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ChatMockup = ({ messages, agentName = "AI Agent" }: ChatMockupProps) => {
  return (
    <div className="backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
      {/* Chat Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#eac565] to-yellow-600 flex items-center justify-center shadow-lg shadow-[#eac565]/30">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg drop-shadow-lg">
              {agentName}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-xs text-white/70">Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400/80 backdrop-blur-sm shadow-md" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80 backdrop-blur-sm shadow-md" />
          <div className="w-3 h-3 rounded-full bg-green-400/80 backdrop-blur-sm shadow-md" />
        </div>
      </div>

      {/* Chat Messages */}
      <motion.div
        className="p-6 h-[24rem] flex flex-col space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } items-end gap-2`}
            variants={messageVariants}
          >
            {msg.sender === "agent" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#eac565] to-yellow-600 flex items-center justify-center flex-shrink-0 mb-1 shadow-lg shadow-[#eac565]/30">
                <Bot className="w-4 h-4 text-black" />
              </div>
            )}
            <div
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              } max-w-[75%]`}
            >
              <div
                className={`rounded-2xl px-4 py-3 shadow-xl ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-[#eac565] to-yellow-600 text-black rounded-br-sm shadow-[#eac565]/40"
                    : "bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {msg.message}
                </p>
              </div>
              {msg.timestamp && (
                <span className="text-xs text-white/50 mt-1 px-2">
                  {msg.timestamp}
                </span>
              )}
            </div>
            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center flex-shrink-0 mb-1 shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: messages.length * 0.4 + 0.5 }}
          className="flex items-end gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#eac565] to-yellow-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#eac565]/30">
            <Bot className="w-4 h-4 text-black" />
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
            <motion.div
              className="w-2 h-2 rounded-full bg-white/60"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-white/60"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-white/60"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Input Mockup */}
      <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={`Message ${agentName}...`}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#eac565]/50 focus:border-[#eac565]/50 transition-all duration-300 cursor-not-allowed"
              disabled
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                className="text-white/40 hover:text-white/60 transition-colors"
                disabled
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            className="bg-gradient-to-br from-[#eac565] to-yellow-600 hover:from-[#d4b456] hover:to-yellow-500 text-black p-3 rounded-xl transition-all duration-300 shadow-lg shadow-[#eac565]/30 hover:shadow-[#eac565]/40 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-white/40 mt-2 text-center">
          This is a demo chat interface
        </p>
      </div>
    </div>
  );
};

export default ChatMockup;
