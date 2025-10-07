import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  confirmCampaignPlan,
  createCampaignStep,
  finalizeCampaign,
  getAIRecommendations,
  createCalendar,
  getCalendarJobStatus,
} from "@/services/userServices";
import { FinalizeCampaignRequest } from "@/types/calender";

// Calendar creation loading steps
export const calendarLoadingSteps = [
  { text: "Initializing content calendar creation...", duration: 5000 },
  { text: "Analyzing campaign objectives and target audience...", duration: 60000 },
  { text: "Generating post ideas and content themes...", duration: 90000 },
  { text: "Crafting engaging captions and hashtags...", duration: 80000 },
  { text: "Scheduling posts across platforms...", duration: 60000 },
  { text: "Optimizing posting times for maximum engagement...", duration: 50000 },
  { text: "Adding final touches and quality checks...", duration: 40000 },
  { text: "Calendar creation complete!", duration: 5000 },
];

export const useCalendarCreation = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const {
    campaignPlan,
    confirmedCampaignId,
    calendarJobId,
    isCreatingCalendar,
    loadingStage,
  } = useAppSelector((state) => state.chat);
  
  const { activeBrandId } = useAppSelector((state) => state.brand);
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [currentCalendarStep, setCurrentCalendarStep] = useState(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate calendar progress based on time
  useEffect(() => {
    if (loadingStage === "creating_calendar" || loadingStage === "polling_calendar") {
      const totalDuration = calendarLoadingSteps.reduce(
        (acc, step) => acc + (step.duration || 0),
        0
      );
      let elapsed = 0;

      const interval = setInterval(() => {
        elapsed += 1000;
        const newProgress = Math.min((elapsed / totalDuration) * 100, 95);
        dispatch(setCalendarProgress(newProgress));

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

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

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

  const handleChatSubmit = async (value: string) => {
    if (!value.trim()) return;

    dispatch(addUserMessage(value));
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

      await finalizeCampaign(confirmedCampaignId, finalizeRequest);
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

  const handleCancelAIRecommendations = () => {
    dispatch(hideAIRecommendationsCard());
    dispatch(
      addBotMessage(
        "No problem! Let's make some changes to the AI recommendations. What would you like to adjust?"
      )
    );
  };

  const pollCalendarJobStatus = async (jobId: string) => {
    const poll = async () => {
      try {
        const statusResponse = await getCalendarJobStatus(jobId);
        const { status, result } = statusResponse.calendar;

        if (status === "complete" && result) {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }

          dispatch(setCalendarProgress(100));
          setCurrentCalendarStep(calendarLoadingSteps.length - 1);

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
      } catch (error) {
        console.error("Error polling calendar job status:", error);
      }
    };

    poll();
    pollingIntervalRef.current = setInterval(poll, 10000);
  };

  const handleCreateCalendar = async (startDate: string) => {
    if (!confirmedCampaignId) return;

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
      dispatch(
        addBotMessage(
          "📅 Calendar creation started! This may take 7-8 minutes..."
        )
      );

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

  const handleCancelDatePicker = () => {
    dispatch(
      addBotMessage(
        "No problem! Let's make some changes. What would you like to adjust?"
      )
    );
  };

  return {
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
  };
};