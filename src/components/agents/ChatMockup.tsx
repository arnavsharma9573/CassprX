"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { Bot, User, Download, FileText } from "lucide-react";
import { useEffect, useState, useRef } from "react";

type ChatMessage = {
  sender: "user" | "agent";
  message: string;
  timestamp?: string;
  type?: "text" | "competitor-analysis" | "download";
  competitors?: Array<{
    name: string;
    type: "direct" | "indirect";
    logo: string;
    strength: string;
    weakness: string;
  }>;
  downloadData?: {
    filename: string;
    size: string;
    description: string;
  };
};

interface ChatMockupProps {
  messages: ChatMessage[];
  autoPlay?: boolean;
  playSpeed?: number;
}

const messageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const CompetitorCard = ({ competitor }: { competitor: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3"
  >
    <div className="flex items-start gap-3 mb-3">
      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
        {typeof competitor.logo === "string" &&
        competitor.logo.startsWith("http") ? (
          <img
            src={competitor.logo}
            alt={`${competitor.name} logo`}
            className="w-10 h-10 object-contain"
          />
        ) : (
          competitor.logo
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-white font-semibold">{competitor.name}</h4>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              competitor.type === "direct"
                ? "bg-red-500/20 text-red-300"
                : "bg-blue-500/20 text-blue-300"
            }`}
          >
            {competitor.type === "direct" ? "Direct" : "Indirect"}
          </span>
        </div>
      </div>
    </div>
    <div className="space-y-2 text-sm">
      <div>
        <span className="text-green-500">Strength: </span>
        <span className="text-gray-300">{competitor.strength}</span>
      </div>
      <div>
        <span className="text-red-200">Weakness: </span>
        <span className="text-gray-300">{competitor.weakness}</span>
      </div>
    </div>
  </motion.div>
);

const DownloadCard = ({ data }: { data: any }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gradient-to-br from-[#eac565]/10 to-[#BF7E43]/5 border border-[#eac565]/30 rounded-xl p-5 mt-3"
  >
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 rounded-xl bg-[#eac565]/20 flex items-center justify-center flex-shrink-0">
        <FileText className="w-7 h-7 text-[#eac565]" />
      </div>
      <div className="flex-1">
        <h4 className="text-white font-semibold mb-1">{data.filename}</h4>
        <p className="text-gray-400 text-sm mb-2">{data.description}</p>
        <p className="text-gray-500 text-xs mb-3">Size: {data.size}</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#eac565] hover:bg-[#d4b456] text-black rounded-lg text-sm font-medium transition-colors">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>
    </div>
  </motion.div>
);

const ChatMockup = ({
  messages,
  autoPlay = true,
  playSpeed = 3500,
}: ChatMockupProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom within the chat container only
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages]);

  useEffect(() => {
    if (!autoPlay) {
      setDisplayedMessages(messages);
      return;
    }

    setDisplayedMessages([]);
    setCurrentMessageIndex(0);

    const timer = setTimeout(() => {
      if (messages.length > 0) {
        setDisplayedMessages([messages[0]]);
        setCurrentMessageIndex(1);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [messages, autoPlay]);

  useEffect(() => {
    if (!autoPlay || currentMessageIndex >= messages.length) return;

    const timer = setTimeout(() => {
      setDisplayedMessages((prev) => [...prev, messages[currentMessageIndex]]);
      setCurrentMessageIndex((prev) => prev + 1);
    }, playSpeed);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, messages, autoPlay, playSpeed]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Fixed Height Container - 35rem with ref for internal scrolling */}
      <div
        ref={chatContainerRef}
        className="h-[35rem] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        <div className="p-6 space-y-4">
          <AnimatePresence>
            {displayedMessages.map((msg, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={messageVariants}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } items-end gap-3`}
              >
                {msg.sender === "agent" && (
                  <div className="w-8 h-8 rounded-full bg-[#eac565] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                )}

                <div
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  } max-w-[80%]`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.sender === "user"
                        ? "bg-[#eac565] text-black rounded-br-sm"
                        : "bg-white/10 text-white rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.message}
                    </p>

                    {/* Competitor Analysis Cards */}
                    {msg.type === "competitor-analysis" && msg.competitors && (
                      <div className="mt-4">
                        {msg.competitors.map((competitor, idx) => (
                          <CompetitorCard key={idx} competitor={competitor} />
                        ))}
                      </div>
                    )}

                    {/* Download Card */}
                    {msg.type === "download" && msg.downloadData && (
                      <DownloadCard data={msg.downloadData} />
                    )}
                  </div>

                  {msg.timestamp && (
                    <span className="text-xs text-white/50 mt-1 px-2">
                      {msg.timestamp}
                    </span>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {autoPlay && currentMessageIndex < messages.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#eac565] flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
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
          )}

          {/* Invisible element for auto-scroll - now inside the container */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatMockup;
