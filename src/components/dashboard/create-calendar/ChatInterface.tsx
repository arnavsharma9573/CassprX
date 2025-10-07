import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useAppSelector } from "@/hooks/redux-hooks";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import { AnimatePresence, motion } from "framer-motion";
import CampaignPlanCard from "./CampaignPlanCard";
import AIRecommendationsCard from "./AIRecommendationsCard";
import DatePickerCard from "./DatePickerCard";
import CalendarMultiStepLoader from "@/components/chat/CalendarMultiStepLoader";
import ThinkingLoader from "@/components/chat/ThinkingLoader";
import {
  useCalendarCreation,
  calendarLoadingSteps,
} from "@/hooks/useCalendarCreation";
import { placeholders } from "@/utils/constants";

export default function ChatInterface() {
  const {
    chatStarted,
    messages,
    campaignPlan,
    showCampaignCard,
    aiRecommendations,
    showAIRecommendationsCard,
    calendarJobId,
    isCreatingCalendar,
    finalized,
    isTyping,
    loadingStage,
    calendarProgress,
  } = useAppSelector((state) => state.chat);

  const {
    isConfirming,
    isFinalizing,
    currentCalendarStep,
    handleInitialSubmit,
    handleChatSubmit,
    handleConfirmCampaign,
    handleCancelCampaign,
    handleFinalizeCampaign,
    handleCancelAIRecommendations,
    handleCreateCalendar,
    handleCancelDatePicker,
  } = useCalendarCreation();

  const [initialInput, setInitialInput] = useState("");
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialInput(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initialInput.trim()) return;
    handleInitialSubmit(initialInput.trim());
  };

  const onChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    handleChatSubmit(inputValue);
    setInputValue("");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Multi-Step Loader for Calendar Creation */}
      <CalendarMultiStepLoader
        loadingStates={calendarLoadingSteps}
        currentStep={currentCalendarStep}
        progress={calendarProgress}
        loading={
          loadingStage === "creating_calendar" ||
          loadingStage === "polling_calendar"
        }
      />

      <AnimatePresence mode="wait">
        {!chatStarted ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0.95 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-4 space-y-16 bg-[url('/BG-image.webp')] bg-no-repeat bg-left-top"
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
                className="opacity-80"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative w-full max-w-2xl"
            >
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col h-screen w-full"
          >
            {/* Header with subtle branding */}
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

            {/* Messages Area with custom scrollbar */}
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
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] sm:max-w-[65%] lg:max-w-[55%] rounded-2xl px-5 py-4 text-white shadow-lg ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-[#E6A550] to-[#BC853B] rounded-br-md ml-12"
                            : "bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-bl-md mr-12 border border-neutral-600/30"
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Thinking Loader - Only for short operations */}
                <AnimatePresence>
                  {isTyping &&
                    loadingStage &&
                    (loadingStage === "creating_campaign" ||
                      loadingStage === "confirming_campaign" ||
                      loadingStage === "fetching_recommendations" ||
                      loadingStage === "finalizing_campaign") && (
                      <ThinkingLoader stage={loadingStage} />
                    )}
                </AnimatePresence>

                {/* Campaign Plan Card */}
                {showCampaignCard && campaignPlan && (
                  <CampaignPlanCard
                    campaignPlan={campaignPlan}
                    onConfirm={handleConfirmCampaign}
                    onCancel={handleCancelCampaign}
                    isConfirming={isConfirming}
                  />
                )}

                {/* AI Recommendations Card */}
                {showAIRecommendationsCard && aiRecommendations && (
                  <AIRecommendationsCard
                    aiRecommendations={aiRecommendations}
                    onConfirm={handleFinalizeCampaign}
                    onCancel={handleCancelAIRecommendations}
                    isConfirming={isFinalizing}
                  />
                )}

                {/* Date Picker Card */}
                {finalized && !isCreatingCalendar && !calendarJobId && (
                  <DatePickerCard
                    onConfirm={handleCreateCalendar}
                    onCancel={handleCancelDatePicker}
                    isCreating={isCreatingCalendar}
                  />
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Enhanced Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex-shrink-0 backdrop-blur-xl p-4 shadow-2xl"
            >
              <div className="max-w-5xl mx-auto">
                <ChatInput
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onSubmit={onChatSubmit}
                  disabled={isTyping || loadingStage !== null}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
