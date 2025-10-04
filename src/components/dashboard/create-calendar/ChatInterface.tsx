import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  addBotMessage,
  addUserMessage,
  startChat,
  setCampaignPlan,
  hideCampaignCard,
  setConfirmedCampaignId,
  setAIRecommendations,
  hideAIRecommendationsCard,
  setFinalized,
  setCalendarJobId,
  setIsCreatingCalendar,
  setIsTyping,
  setLoadingStage,
  setCalendarProgress,
} from "@/store/feature/chatSlice";
import { setCalendarData } from "@/store/feature/brandSlice";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  confirmCampaignPlan,
  createCampaignStep,
  finalizeCampaign,
  getAIRecommendations,
  createCalendar,
  getCalendarJobStatus,
} from "@/services/userServices";
import CampaignPlanCard from "./CampaignPlanCard";
import AIRecommendationsCard from "./AIRecommendationsCard";
import DatePickerCard from "./DatePickerCard";

import {
  CampaignPlanResponse,
  FinalizeCampaignRequest,
} from "@/types/calender";
import CalendarMultiStepLoader from "@/components/chat/CalendarMultiStepLoader";
import ThinkingLoader from "@/components/chat/ThinkingLoader";

const placeholders = [
  "What's your next campaign idea?",
  "Who is your target audience today?",
  "Where should your brand go next?",
  "Write a catchy caption for Instagram",
  "How to plan a full campaign in minutes?",
];

// Calendar creation loading steps
const calendarLoadingSteps = [
  { text: "Initializing content calendar creation...", duration: 5000 },
  { text: "Analyzing campaign objectives and target audience...", duration: 60000 },
  { text: "Generating post ideas and content themes...", duration: 90000 },
  { text: "Crafting engaging captions and hashtags...", duration: 80000 },
  { text: "Scheduling posts across platforms...", duration: 60000 },
  { text: "Optimizing posting times for maximum engagement...", duration: 50000 },
  { text: "Adding final touches and quality checks...", duration: 40000 },
  { text: "Calendar creation complete!", duration: 5000 },
];

export default function ChatInterface() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    chatStarted,
    messages,
    campaignPlan,
    showCampaignCard,
    aiRecommendations,
    showAIRecommendationsCard,
    confirmedCampaignId,
    calendarJobId,
    isCreatingCalendar,
    finalized,
    isTyping,
    loadingStage,
    calendarProgress,
  } = useAppSelector((state) => state.chat);
  const { activeBrandId } = useAppSelector((state) => state.brand);
  
  const [initialInput, setInitialInput] = useState("");
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [currentCalendarStep, setCurrentCalendarStep] = useState(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulate calendar progress based on time
  useEffect(() => {
    if (loadingStage === "creating_calendar" || loadingStage === "polling_calendar") {
      const totalDuration = calendarLoadingSteps.reduce((acc, step) => acc + (step.duration || 0), 0);
      let elapsed = 0;
      
      const interval = setInterval(() => {
        elapsed += 1000;
        const newProgress = Math.min((elapsed / totalDuration) * 100, 95); // Cap at 95% until actually complete
        dispatch(setCalendarProgress(newProgress));
        
        // Update current step based on progress
        let cumulativeDuration = 0;
        for (let i = 0; i < calendarLoadingSteps.length; i++) {
          cumulativeDuration += calendarLoadingSteps[i].duration || 0;
          if (elapsed < cumulativeDuration) {
            setCurrentCalendarStep(i);
            break;
          }
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [loadingStage, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialInput(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initialInput.trim()) return;
    handleInitialSubmit(initialInput.trim());
  };

  const handleInitialSubmit = async (value: string) => {
    if (!value.trim()) return;

    dispatch(addUserMessage(value));
    dispatch(startChat());
    dispatch(setIsTyping(true));
    dispatch(setLoadingStage("creating_campaign"));

    if (!activeBrandId) {
      dispatch(addBotMessage("⚠️ Please select a brand first."));
      dispatch(setIsTyping(false));
      dispatch(setLoadingStage(null));
      return;
    }

    try {
      const response = await createCampaignStep(value, activeBrandId);

      if (response.campaignPlan) {
        dispatch(setCampaignPlan(response.campaignPlan));
        dispatch(
          addBotMessage(
            "🎉 Great! I've created a comprehensive campaign plan for you. Please review the details below and confirm to proceed."
          )
        );
      } else {
        dispatch(addBotMessage(response.reply || "✅ Got it, let's continue."));
      }
    } catch (err) {
      dispatch(addBotMessage("⚠️ Something went wrong. Please try again."));
    } finally {
      dispatch(setIsTyping(false));
      dispatch(setLoadingStage(null));
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    dispatch(addUserMessage(inputValue));
    dispatch(setIsTyping(true));
    dispatch(setLoadingStage("creating_campaign"));

    if (!activeBrandId) {
      dispatch(addBotMessage("⚠️ Please select a brand first."));
      dispatch(setIsTyping(false));
      dispatch(setLoadingStage(null));
      return;
    }

    try {
      const response = await createCampaignStep(inputValue, activeBrandId);

      if (response.campaignPlan) {
        dispatch(setCampaignPlan(response.campaignPlan));
        dispatch(
          addBotMessage(
            "🎉 Great! I've created a comprehensive campaign plan for you. Please review the details below and confirm to proceed."
          )
        );
      } else {
        dispatch(
          addBotMessage(response.reply || "✅ Got it, ready for next step.")
        );
      }
    } catch (err) {
      dispatch(addBotMessage("⚠️ Something went wrong. Please try again."));
    } finally {
      dispatch(setIsTyping(false));
      dispatch(setLoadingStage(null));
    }

    setInputValue("");
  };

  const handleConfirmCampaign = async () => {
    if (!campaignPlan) return;

    setIsConfirming(true);
    dispatch(setIsTyping(true));
    dispatch(setLoadingStage("confirming_campaign"));

    try {
      const confirmResponse = await confirmCampaignPlan(campaignPlan);
      const campaignId = confirmResponse.campaignPlan.campaignId;

      dispatch(setConfirmedCampaignId(campaignId));
      dispatch(hideCampaignCard());
      dispatch(
        addBotMessage(
          "✅ Campaign plan confirmed! Fetching AI recommendations..."
        )
      );
      
      dispatch(setLoadingStage("fetching_recommendations"));

      const aiResponse = await getAIRecommendations(campaignId);
      dispatch(setAIRecommendations(aiResponse.recommendations));
      dispatch(
        addBotMessage(
          "🤖 AI Recommendations received! Please review and select your preferred platforms and duration below."
        )
      );
    } catch (error) {
      console.error("Error during campaign flow:", error);
      dispatch(
        addBotMessage(
          "⚠️ Something went wrong during the campaign flow. Please try again."
        )
      );
    } finally {
      setIsConfirming(false);
      dispatch(setIsTyping(false));
      dispatch(setLoadingStage(null));
    }
  };

  const handleCancelCampaign = () => {
    dispatch(hideCampaignCard());
    dispatch(
      addBotMessage(
        "No problem! Let's make some changes to your campaign plan. What would you like to adjust?"
      )
    );
  };

  const handleFinalizeCampaign = async (
    selectedPlatforms: string[],
    selectedDuration: number
  ) => {
    if (!confirmedCampaignId) return;

    setIsFinalizing(true);
    dispatch(setIsTyping(true));
    dispatch(setLoadingStage("finalizing_campaign"));

    try {
      const finalizeRequest: FinalizeCampaignRequest = {
        selected_platforms: selectedPlatforms,
        selected_duration_weeks: selectedDuration,
      };

      const finalizeResponse = await finalizeCampaign(
        confirmedCampaignId,
        finalizeRequest
      );
      dispatch(setFinalized(true));
      dispatch(hideAIRecommendationsCard());
      dispatch(
        addBotMessage(
          "🎉 Campaign finalized successfully! Now let's select a start date for your calendar."
        )
      );
    } catch (error) {
      console.error("Failed to finalize campaign:", error);
      dispatch(
        addBotMessage("⚠️ Failed to finalize campaign. Please try again.")
      );
    } finally {
      setIsFinalizing(false);
      dispatch(setIsTyping(false));
      dispatch(setLoadingStage(null));
    }
  };

  const handleCreateCalendar = async (startDate: string) => {
    if (!confirmedCampaignId) return;

    // Don't set isTyping for calendar creation - we use the multi-step loader instead
    dispatch(setIsCreatingCalendar(true));
    dispatch(setLoadingStage("creating_calendar"));
    dispatch(setCalendarProgress(0));
    setCurrentCalendarStep(0);

    try {
      const createResponse = await createCalendar(
        startDate,
        confirmedCampaignId
      );
      const jobId = createResponse.calendar.contentCalendar.job_id;

      dispatch(setCalendarJobId(jobId));
      
      // Add bot message but don't trigger typing indicator
      dispatch(
        addBotMessage(
          "📅 Calendar creation started! This may take 7-8 minutes..."
        )
      );

      // Start polling
      dispatch(setLoadingStage("polling_calendar"));
      pollCalendarJobStatus(jobId);
    } catch (error) {
      console.error("Failed to create calendar:", error);
      dispatch(
        addBotMessage("⚠️ Failed to create calendar. Please try again.")
      );
      dispatch(setLoadingStage(null));
      dispatch(setIsCreatingCalendar(false));
    }
  };

  const pollCalendarJobStatus = async (jobId: string) => {
    const poll = async () => {
      try {
        const statusResponse = await getCalendarJobStatus(jobId);
        const { status, result } = statusResponse.calendar;

        if (status === "complete" && result) {
          // Clear polling interval
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }

          // Set progress to 100%
          dispatch(setCalendarProgress(100));
          setCurrentCalendarStep(calendarLoadingSteps.length - 1);

          // Wait a moment to show 100%
          setTimeout(() => {
            dispatch(
              setCalendarData({ brandId: activeBrandId!, calendarData: result })
            );
            dispatch(
              addBotMessage(
                "🎉 Your content calendar is ready! Redirecting to calendar view..."
              )
            );
            dispatch(setLoadingStage(null));
            dispatch(setIsCreatingCalendar(false));

            // Navigate after showing message
            setTimeout(() => {
              router.push(`/dashboard/${activeBrandId}/content-calendar`);
            }, 2000);
          }, 1000);

          return;
        } else if (status === "failed") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }

          dispatch(
            addBotMessage("⚠️ Calendar creation failed. Please try again.")
          );
          dispatch(setLoadingStage(null));
          dispatch(setIsCreatingCalendar(false));
          return;
        }

        // Continue polling if still in progress
      } catch (error) {
        console.error("Error polling calendar job status:", error);
        // Continue polling even on error
      }
    };

    // Start polling immediately
    poll();
    
    // Set up interval for subsequent polls
    pollingIntervalRef.current = setInterval(poll, 10000);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleCancelAIRecommendations = () => {
    dispatch(hideAIRecommendationsCard());
    dispatch(
      addBotMessage(
        "No problem! Let's make some changes to the AI recommendations. What would you like to adjust?"
      )
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Multi-Step Loader for Calendar Creation */}
      <CalendarMultiStepLoader
        loadingStates={calendarLoadingSteps}
        currentStep={currentCalendarStep}
        progress={calendarProgress}
        loading={loadingStage === "creating_calendar" || loadingStage === "polling_calendar"}
      />

      <AnimatePresence mode="wait">
        {!chatStarted ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0.95 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-4 space-y-16 bg-[url('/BG-image.png')] bg-no-repeat bg-left-top"
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

                {/* Thinking Loader - Only for short operations, NOT for calendar creation */}
                <AnimatePresence>
                  {isTyping && loadingStage && (
                    loadingStage === "creating_campaign" ||
                    loadingStage === "confirming_campaign" ||
                    loadingStage === "fetching_recommendations" ||
                    loadingStage === "finalizing_campaign"
                  ) && (
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
                    onCancel={() =>
                      dispatch(
                        addBotMessage(
                          "No problem! Let's make some changes. What would you like to adjust?"
                        )
                      )
                    }
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
                  onSubmit={handleChatSubmit}
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