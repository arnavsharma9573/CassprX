"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  addUserMessage,
  addBotMessage,
  initializeChat,
  progressConversation,
  finalizeChatAndGenerateCalendar,
} from "@/store/feature/chatSlice";
import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { QuestionOption, questionFlow } from "@/lib/questionDb";
import { Check } from "lucide-react";
import Image from "next/image";

export default function ChatInterface() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { messages, isGenerating, currentQuestionId } = useAppSelector(
    (state) => state.chat
  );
  const { activeBrandId } = useAppSelector((state) => state.brand);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [generationCompleted, setGenerationCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  // Show welcome screen for 2 seconds, then start the chat
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeScreen(false);
    }, 2000); // 2-second delay

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // Initialize the chat only when the welcome screen is hidden
  useEffect(() => {
    if (!showWelcomeScreen) {
      dispatch(initializeChat());
    }
  }, [showWelcomeScreen, dispatch]);

  useEffect(() => {
    if (generationCompleted) {
      router.push(`/dashboard/${activeBrandId}/content-calendar`);
    }
  }, [generationCompleted, router, activeBrandId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handler for when a user clicks a multiple-choice option
  const handleOptionClick = (option: QuestionOption) => {
    if (!currentQuestionId || selectedOption) return; // Prevent multiple clicks

    setSelectedOption(option.value); // Mark option as selected for UI feedback

    // 1. Dispatch the user's choice to show it in the chat
    dispatch(addUserMessage(option.label));

    // 2. Find the next question based on the user's choice
    const nextQuestionId = option.nextQuestionId;
    const nextQuestion = questionFlow[nextQuestionId];

    if (nextQuestion) {
      // 3. Use a timeout to simulate the bot "thinking"
      setTimeout(() => {
        dispatch(addBotMessage(nextQuestion.text));
        dispatch(progressConversation(nextQuestionId));
        setSelectedOption(null); // Reset for the next question
      }, 800);
    }
  };

  // Handler for when the user submits free-form text
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || !currentQuestionId) return;

    dispatch(addUserMessage(trimmedInput));
    setInputValue("");

    const currentQuestion = questionFlow[currentQuestionId];
    if (!currentQuestion || currentQuestion.type !== "text") return;

    const nextQuestionId = currentQuestion.nextQuestionId;
    if (nextQuestionId) {
      const nextQuestion = questionFlow[nextQuestionId];
      setTimeout(() => {
        dispatch(addBotMessage(nextQuestion.text));
        dispatch(progressConversation(nextQuestionId));
      }, 500);
    }
  };

  // Handler for the final "Generate Calendar" action
  const handleGenerateCalendar = () => {
    dispatch(
      addBotMessage(
        "Great! I have everything I need. Generating your new content calendar now..."
      )
    );
    dispatch(finalizeChatAndGenerateCalendar())
      .unwrap()
      .then(() => {
        setGenerationCompleted(true);
      })
      .catch((error) => {
        console.error("Failed to generate calendar:", error);
        dispatch(
          addBotMessage(
            "Sorry, something went wrong while generating the calendar. Please try again."
          )
        );
      });
  };

  // Determine the current state of the conversation
  const currentQuestion = currentQuestionId
    ? questionFlow[currentQuestionId]
    : null;
  const isMultipleChoice = currentQuestion?.type === "multiple-choice";
  const isFinalStep = currentQuestion?.type === "final";

  return (
    <div
      className={`relative min-h-screen bg-black ${
        showWelcomeScreen
          ? "bg-[url('/BG-image.png')] bg-no-repeat bg-left-top"
          : ""
      }`}
    >
      <AnimatePresence mode="wait">
        {showWelcomeScreen ? (
          <motion.div
            key="welcome"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image
                src="/Logo.svg"
                alt="logo"
                width={1180}
                height={800}
                className="opacity-80 max-w-5xl w-full"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col h-screen w-full"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex-shrink-0 border-b border-neutral-800/50 bg-neutral-950/30 backdrop-blur-xl px-4 py-3 h-19"
            >
              <div className="max-w-5xl mx-auto flex items-center mt-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#E6A550] to-[#BC853B] flex items-center justify-center">
                  <span className="text-xs font-bold text-black">AI</span>
                </div>
                <span className="ml-3 text-sm text-neutral-400 font-medium">
                  Campaign Assistant
                </span>
              </div>
            </motion.div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-700 hover:scrollbar-thumb-neutral-600">
              <div className="max-w-5xl mx-auto space-y-4">
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`whitespace-pre-wrap max-w-[75%] sm:max-w-[65%] lg:max-w-[55%] rounded-2xl px-5 py-4 text-white shadow-lg ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-[#E6A550] to-[#BC853B] rounded-br-md ml-12"
                            : "bg-neutral-900 rounded-bl-md mr-12 border border-neutral-600/30"
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area / Options / Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex-shrink-0 backdrop-blur-xl p-4 shadow-2xl"
            >
              <div className="max-w-5xl mx-auto text-center">
                <AnimatePresence>
                  {isMultipleChoice && !isGenerating && (
                    <motion.div
                      key="options"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-wrap justify-center gap-3 mb-4"
                    >
                      {currentQuestion?.options?.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleOptionClick(option)}
                          disabled={!!selectedOption}
                          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 ${
                            selectedOption === option.value
                              ? "bg-green-600 border-green-500 text-white"
                              : selectedOption
                              ? "bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed"
                              : "bg-neutral-700/50 border-neutral-600/80 text-neutral-200 hover:bg-neutral-700 hover:border-neutral-500"
                          }`}
                        >
                          {selectedOption === option.value && (
                            <Check size={16} />
                          )}
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {isFinalStep && !isGenerating ? (
                    <motion.div
                      key="generate"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <button
                        onClick={handleGenerateCalendar}
                        className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                      >
                        ✨ Generate Calendar
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="input"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={
                        isGenerating || isMultipleChoice ? "opacity-50" : ""
                      }
                    >
                      <ChatInput
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onSubmit={handleChatSubmit}
                        disabled={isGenerating || isMultipleChoice}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {isGenerating && (
                  <div className="text-center mt-4 text-slate-400">
                    Generating, please wait...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
