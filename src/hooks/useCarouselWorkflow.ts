import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux-hooks";
import {
  selectActiveWorkflow,
  selectWorkflowTaskData,
  completePhase,
  storeApiResult,
  startNextPhase,
  submitStep,
  resetWorkflow,
} from "@/store/feature/workflowSlice";
import {
  generateContentIdeas,
  generateFramePrompts,
  startVisualGeneration,
  pollCarouselJobStatus,
  BusinessProfile,
  FramePromptInputs,
} from "@/lib/workspace/carouselApiLogic";
import { contentCreatorFlows } from "@/lib/workspace/contentCreatorFlows";
import { Message } from "@/components/dashboard/workspace/ChatInterfaceWorkspace";
import { streamMessage } from "@/lib/helper";

interface CarouselWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceActiveBrand: any;
}

export const useCarouselWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
  workspaceActiveBrand,
}: CarouselWorkflowProps) => {
  const dispatch = useAppDispatch();
  const workflowData = useAppSelector(selectWorkflowTaskData);
  const {
    activeSubTask,
    currentPhaseIndex,
    currentStepIndex,
    phaseStatus,
    apiResult,
  } = useAppSelector(selectActiveWorkflow);

  const currentFlow =
    activeSubTask === "CAROUSEL" ? contentCreatorFlows[activeSubTask] : null;
  const currentPhase = currentFlow
    ? currentFlow.phases[currentPhaseIndex]
    : null;
  const currentQuestion = currentPhase
    ? currentPhase.steps[currentStepIndex]
    : null;

  useEffect(() => {
    if (activeSubTask !== "CAROUSEL") return;

    if (phaseStatus === "in-progress" && currentQuestion) {
      const questionAlreadyAsked = messages.some(
        (msg) => msg.id === `q-${currentPhaseIndex}-${currentStepIndex}`
      );
      if (!questionAlreadyAsked) {
        streamMessage(
          `q-${currentPhaseIndex}-${currentStepIndex}`,
          currentQuestion.question,
          setMessages,
          () => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === `q-${currentPhaseIndex}-${currentStepIndex}`
                  ? {
                      ...msg,
                      options: currentQuestion.options,
                      type: currentQuestion.type,
                    }
                  : msg
              )
            );
          }
        );
      }
      return;
    }

    if (
      phaseStatus === "in-progress" &&
      currentPhase &&
      currentStepIndex >= currentPhase.steps.length
    ) {
      if (currentPhase.name !== "FINALIZE") {
        dispatch(completePhase());
      }
      return;
    }

    if (
      phaseStatus === "awaiting-api-call" &&
      currentPhase?.name === "IDEATION"
    ) {
      const isAlreadyRunning = messages.some(
        (m) => m.id === "idea-select" || m.id === "thinking-ideas"
      );
      if (isAlreadyRunning) return;

      setIsLoading(true);
      streamMessage(
        "thinking-ideas",
        "Got it! Thinking of some creative ideas for you...",
        setMessages,
        () => {
          const businessProfileData: BusinessProfile = {
            product_category: workflowData.product_category,
            product_description: workflowData.product_description,
            target_audience: workflowData.target_audience,
            pain_point: workflowData.pain_point,
            content_goal: workflowData.content_goal,
            industry_focus: workflowData.industry_focus,
          };

          generateContentIdeas(businessProfileData)
            .then((ideas) => {
              dispatch(storeApiResult({ ideas }));
              const ideaTitles = ideas.map((i) => i.title);
              streamMessage(
                "idea-select",
                "Here are a few ideas. Which one do you like best?",
                setMessages,
                () => {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === "idea-select"
                        ? { ...msg, options: ideaTitles, type: "select" }
                        : msg
                    )
                  );
                  setIsLoading(false);
                }
              );
            })
            .catch((err) => {
              streamMessage(
                "error-ideas",
                "Sorry, I had trouble generating ideas.",
                setMessages
              );
              setIsLoading(false);
            });
        }
      );
    }
  }, [
    activeSubTask,
    phaseStatus,
    currentQuestion,
    currentPhase,
    currentStepIndex,
    dispatch,
    setMessages,
    setIsLoading,
    workflowData,
    messages,
  ]);

  const handleCarouselSubmit = (inputValue: string) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: inputValue }));
    } else {
      triggerFinalCarouselGeneration();
    }
  };

  const handleCarouselOptionSelect = (option: string) => {
    if (phaseStatus === "in-progress" && currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: option }));
    } else if (
      phaseStatus === "awaiting-api-call" &&
      currentPhase?.name === "IDEATION" &&
      apiResult?.ideas
    ) {
      const selectedIdea = apiResult.ideas.find((i: any) => i.title === option);
      if (selectedIdea) {
        dispatch(startNextPhase({ newData: { selected_idea: selectedIdea } }));
      }
    }
  };

  const triggerFinalCarouselGeneration = async () => {
    if (!workspaceActiveBrand || workspaceActiveBrand.isDefault) {
      streamMessage(
        "err-brand",
        "Please select a brand profile to generate content.",
        setMessages
      );
      return;
    }
    const brandKit = workspaceActiveBrand.brandKits?.[0];
    if (!brandKit?.kitData) {
      streamMessage(
        "err-kit",
        "The selected brand doesn't have a configured brand kit.",
        setMessages
      );
      return;
    }

    setIsLoading(true);
    try {
      const { visual_identity } = brandKit.kitData;
      const brandGuidelines = {
        primaryColor:
          visual_identity?.color_palette?.primary_colors?.[0]?.hex || "#FFFFFF",
        fontFamily: visual_identity?.typography?.primary_font || "Inter",
      };
      const businessProfile: BusinessProfile = {
        product_category: workflowData.product_category,
        product_description: workflowData.product_description,
        target_audience: workflowData.target_audience,
        pain_point: workflowData.pain_point,
        content_goal: workflowData.content_goal,
        industry_focus: workflowData.industry_focus,
      };
      const framePromptInputs: FramePromptInputs = {
        platform: workflowData.platform,
        brand_tone: workflowData.brand_tone,
        call_to_action: workflowData.call_to_action,
        visual_style: workflowData.visual_style,
        key_statistics: workflowData.key_statistics,
        personal_story: workflowData.personal_story,
        selected_idea: workflowData.selected_idea,
      };

      await new Promise<void>((resolve) =>
        streamMessage(
          "gen-prompts",
          "Perfect! Generating the text for each frame...",
          setMessages,
          resolve
        )
      );
      const framePrompts = await generateFramePrompts(
        businessProfile,
        framePromptInputs
      );

      const shouldGenerateImages =
        workflowData.generate_images === "Generate Images";
      const { jobId } = await startVisualGeneration(
        framePrompts,
        brandGuidelines,
        shouldGenerateImages
      );

      await new Promise<void>((resolve) =>
        streamMessage(
          "job-start",
          `Your carousel is being created! The job ID is ${jobId}. I'll let you know when it's done.`,
          setMessages,
          resolve
        )
      );

      const pollInterval = setInterval(async () => {
        const job = await pollCarouselJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          const finalMessage =
            job.status === "completed" && job.result?.image_urls
              ? `Your carousel is ready! Here are the links: ${job.result.image_urls.join(
                  ", "
                )}`
              : "Sorry, something went wrong while creating the carousel.";
          streamMessage("job-end", finalMessage, setMessages);
        }
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      streamMessage(
        "err-api",
        "I ran into an issue trying to generate that. Please try again.",
        setMessages
      );
    }
  };

  const isCarouselInputDisabled =
    phaseStatus === "awaiting-api-call" || currentQuestion?.type === "select";

  return {
    handleCarouselSubmit,
    handleCarouselOptionSelect,
    isCarouselInputDisabled,
  };
};
