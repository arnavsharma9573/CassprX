"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, Calendar } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const AiChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message from the bot
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: "Hello! I'm here to help you generate a content calendar.",
      },
      {
        sender: "ai",
        text: "What's the primary goal for your campaign? (e.g., brand awareness, lead generation, product launch)",
      },
    ]);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    // --- Dummy AI Response Logic ---
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
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto overflow-hidden shadow-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700">
      {/* Header */}
      <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center space-x-3">
        <div className="relative">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Bot size={24} className="text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">
            Content Strategy AI
          </h2>
          <p className="text-sm text-green-400">Online • Ready to help</p>
        </div>
        <div className="flex items-center text-sm text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full">
          <Calendar size={14} className="mr-1" />
          Content Calendar
        </div>
      </div>

      {/* Message Display Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-neutral-900/50 to-neutral-800/50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex ${
                message.sender === "user" ? "flex-row-reverse" : ""
              } max-w-lg`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 mx-2 ${
                  message.sender === "user" ? "ml-3" : "mr-3"
                }`}
              >
                {message.sender === "user" ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                    : "bg-neutral-800 text-gray-200 rounded-bl-none border border-neutral-700"
                }`}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-lg">
              <div className="flex-shrink-0 mx-2 mr-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-neutral-800 text-gray-200 rounded-bl-none border border-neutral-700">
                <div className="flex items-center space-x-1.5">
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-neutral-900 border-t border-neutral-800">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me about your campaign goals..."
              className="w-full px-4 py-3 pr-10 border border-neutral-700 rounded-xl bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              disabled={isLoading}
            />
            <Sparkles
              size={18}
              className="absolute right-3 top-3.5 text-neutral-500"
            />
          </div>
          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            disabled={isLoading || input.trim() === ""}
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-xs text-neutral-500 mt-2 text-center">
          Content Strategy AI • Powered by advanced content planning algorithms
        </p>
      </div>
    </div>
  );
};

export default AiChatBot;
