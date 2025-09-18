"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const AiChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message from the bot with staggered animation
  useEffect(() => {
    const welcomeMessages = [
      {
        sender: "ai" as const,
        text: "Hello! I'm here to help you generate a content calendar.",
      },
      {
        sender: "ai" as const,
        text: "What's the primary goal for your campaign? (e.g., brand awareness, lead generation, product launch)",
      },
    ];

    // Add messages with delay for natural conversation feel
    welcomeMessages.forEach((msg, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
      }, index * 800);
    });
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        text: `That's a great goal! Let's brainstorm some content pillars around "${input}". How about we focus on Educational, Inspirational, and Community-focused content?`,
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto overflow-hidden shadow-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800/50 backdrop-blur-xl">
      {/* Enhanced Header with animations */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50 flex items-center space-x-3"
      >
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-gradient-to-r from-[#E6A550] to-[#BC853B] rounded-full shadow-lg"
          >
            <Bot size={24} className="text-white" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-950"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">
            Content Strategy AI
          </h2>
          <p className="text-sm text-green-400 font-medium">
            Online • Ready to help
          </p>
        </div>
        <div className="flex items-center text-sm text-neutral-300 bg-neutral-800/60 backdrop-blur-sm px-3 py-1 rounded-full border border-neutral-700/50">
          <Calendar size={14} className="mr-2 text-[#E6A550]" />
          Content Calendar
        </div>
      </motion.div>

      {/* Enhanced Message Display Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-neutral-950/50 to-neutral-900/50 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-700 hover:scrollbar-thumb-neutral-600">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: index === messages.length - 1 ? 0 : 0,
                ease: "easeOut",
              }}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex ${
                  message.sender === "user" ? "flex-row-reverse" : ""
                } max-w-lg group`}
              >
                {/* Enhanced Avatar */}
                <div
                  className={`flex-shrink-0 mx-3 ${
                    message.sender === "user" ? "ml-3" : "mr-3"
                  }`}
                >
                  {message.sender === "user" ? (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-[#E6A550] to-[#BC853B] flex items-center justify-center shadow-lg"
                    >
                      <User size={16} className="text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-neutral-700 to-neutral-600 flex items-center justify-center shadow-lg border border-neutral-600/50"
                    >
                      <Bot size={16} className="text-[#E6A550]" />
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Message Bubble */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`px-5 py-4 rounded-2xl shadow-lg transition-all duration-200 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-white rounded-br-md ml-4"
                      : "bg-gradient-to-r from-neutral-800 to-neutral-750 text-gray-200 rounded-bl-md mr-4 border border-neutral-600/30"
                  }`}
                >
                  <div className="text-sm leading-relaxed">{message.text}</div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced Typing Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="flex max-w-lg group">
                <div className="flex-shrink-0 mx-3 mr-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neutral-700 to-neutral-600 flex items-center justify-center shadow-lg border border-neutral-600/50">
                    <Bot size={16} className="text-[#E6A550]" />
                  </div>
                </div>
                <div className="px-5 py-4 rounded-2xl bg-gradient-to-r from-neutral-800 to-neutral-750 text-gray-200 rounded-bl-md mr-4 border border-neutral-600/30 shadow-lg">
                  <div className="flex items-center space-x-1.5">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-[#E6A550] rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                      className="w-2 h-2 bg-[#E6A550] rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                      className="w-2 h-2 bg-[#E6A550] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-4 bg-neutral-950/90 backdrop-blur-xl border-t border-neutral-800/50 shadow-2xl"
      >
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-3"
        >
          <div className="relative flex-1 group">
            {/* Enhanced Input with glow effect */}
            <div
              className={`
              relative w-full rounded-2xl transition-all duration-200 ease-out
              ${
                isFocused
                  ? "bg-neutral-800/80 shadow-2xl shadow-[#E6A550]/10 ring-2 ring-[#E6A550]/50"
                  : "bg-neutral-800/60 shadow-lg hover:bg-neutral-800/70"
              }
              backdrop-blur-xl border border-neutral-700/50 hover:border-neutral-600/50
            `}
            >
              {/* Animated glow effect */}
              <div
                className={`
                absolute inset-0 rounded-2xl transition-opacity duration-200
                ${isFocused ? "opacity-100" : "opacity-0"}
                bg-gradient-to-r from-[#E6A550]/5 via-transparent to-[#BC853B]/5
              `}
              />

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Tell me about your campaign goals..."
                className="
                  w-full px-5 py-3 pr-12 rounded-2xl
                  bg-transparent text-white placeholder-neutral-400
                  focus:outline-none relative z-10
                  transition-all duration-200 text-sm
                "
                disabled={isLoading}
                autoComplete="off"
              />

              <Sparkles
                size={18}
                className={`
                  absolute right-4 top-3.5 transition-all duration-200
                  ${isFocused ? "text-[#E6A550]" : "text-neutral-500"}
                `}
              />
            </div>
          </div>

          {/* Enhanced Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`
              p-3 rounded-2xl text-white transition-all duration-200 flex items-center justify-center shadow-lg
              ${
                input.trim() && !isLoading
                  ? "bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:shadow-xl hover:shadow-[#E6A550]/25"
                  : "bg-neutral-600 cursor-not-allowed"
              }
            `}
            disabled={isLoading || input.trim() === ""}
          >
            <Send size={18} />
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-neutral-500 mt-3 text-center font-medium"
        >
          Content Strategy AI • Powered by advanced content planning algorithms
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AiChatBot;
