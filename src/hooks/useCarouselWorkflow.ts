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

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    if (activeSubTask !== "CAROUSEL") return;

    if (phaseStatus === "in-progress" && currentQuestion) {
      streamMessage(
        `q-${currentPhaseIndex}-${currentStepIndex}`,
        currentQuestion.question,
        setMessages,
        () => {
          const finalOptions: string[] | undefined = Array.isArray(
            currentQuestion.options
          )
            ? currentQuestion.options
            : undefined;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === `q-${currentPhaseIndex}-${currentStepIndex}`
                ? {
                    ...msg,
                    options: finalOptions,
                    type: currentQuestion.type,
                  }
                : msg
            )
          );
        }
      );
      return;
    }

    if (phaseStatus === "in-progress" && currentPhase && !currentQuestion) {
      const isLastPhase = currentFlow
        ? currentPhaseIndex === currentFlow.phases.length - 1
        : false;
      if (isLastPhase) {
        triggerVisualGeneration(workflowData);
      } else {
        dispatch(completePhase());
      }
      return;
    }

    if (phaseStatus === "awaiting-api-call") {
      if (currentPhase?.name === "IDEATION") {
        triggerIdeaGeneration();
      } else if (currentPhase?.name === "DETAILS") {
        triggerFramePromptGeneration();
      }
    }
  }, [
    activeSubTask,
    phaseStatus,
    currentQuestion,
    currentPhase,
    currentStepIndex,
    dispatch,
  ]);

  // ✅ IDEA GENERATION
  const triggerIdeaGeneration = () => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: "loading-ideas",
        role: "assistant",
        content: "Thinking of creative ideas...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);

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
        setMessages((prev) => prev.filter((m) => m.id !== "loading-ideas"));
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
          }
        );
      })
      .catch(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === "loading-ideas"
              ? {
                  ...msg,
                  isLoading: false,
                  isError: true,
                  content:
                    "❌ Failed to generate ideas. Tap Retry to try again.",
                  onRetry: triggerIdeaGeneration,
                }
              : msg
          )
        );
      })
      .finally(() => setIsLoading(false));
  };

  // ✅ FRAME PROMPT GENERATION
  const triggerFramePromptGeneration = async () => {
    const messageId = "loading-prompts";
    setIsLoading(true);
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== messageId),
      {
        id: messageId,
        role: "assistant",
        content: "Generating text for each frame...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);

    try {
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
      const framePrompts = await generateFramePrompts(
        businessProfile,
        framePromptInputs
      );

      // Format all prompts into a single, readable string
      const formattedPrompts =
        "Here are the generated frame prompts:\n\n" +
        framePrompts.join("\n\n---\n\n");

      // Remove the loading message
      setMessages((prev) => prev.filter((m) => m.id !== messageId));

      // Stream the entire formatted block as one message
      streamMessage("show-prompts", formattedPrompts, setMessages, () => {
        // Only advance to the next phase after the message is fully displayed
        dispatch(startNextPhase({ newData: { frame_prompts: framePrompts } }));
      });
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                isLoading: false,
                isError: true,
                content:
                  "❌ Failed to generate frame prompts. Tap Retry to try again.",
                onRetry: triggerFramePromptGeneration,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ VISUAL GENERATION
  const triggerVisualGeneration = async (
    currentWorkflowData: Record<string, any>
  ) => {
    if (!workspaceActiveBrand || workspaceActiveBrand.isDefault) {
      streamMessage(
        "err-brand",
        "⚠️ Please select a brand profile to generate content.",
        setMessages
      );
      return;
    }

    const brandKit = workspaceActiveBrand.brandKits?.[0];
    if (!brandKit?.kitData) {
      streamMessage(
        "err-kit",
        "⚠️ The selected brand doesn't have a configured brand kit.",
        setMessages
      );
      return;
    }

    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: "loading-visuals",
        role: "assistant",
        content: "🎨 Creating your carousel visuals...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);

    try {
      const { visual_identity } = brandKit.kitData;
      const brandGuidelines = {
        primaryColor:
          visual_identity?.color_palette?.primary_colors?.[0]?.hex || "#FFFFFF",
        fontFamily: visual_identity?.typography?.primary_font || "Inter",
      };
      const shouldGenerateImages =
        currentWorkflowData.generate_images?.trim() === "Generate Images";

      const { jobId } = await startVisualGeneration(
        currentWorkflowData.frame_prompts,
        brandGuidelines,
        shouldGenerateImages
      );

      const pollInterval = setInterval(async () => {
        const job = await pollCarouselJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);

          if (job.status === "completed" && job.result?.image_urls?.length) {
            setMessages((prev) =>
              prev.filter((m) => m.id !== "loading-visuals")
            );
            setMessages((prev) => [
              ...prev,
              {
                id: "job-end",
                role: "assistant",
                content: "✅ Your carousel is ready!",
                imageUrls: job.result.image_urls,
                timestamp: new Date(),
              },
            ]);
            dispatch(resetWorkflow());
          } else {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === "loading-visuals"
                  ? {
                      ...msg,
                      isLoading: false,
                      isError: true,
                      content:
                        "❌ Something went wrong while generating visuals. Tap Retry to try again.",
                      onRetry: () =>
                        triggerVisualGeneration(currentWorkflowData),
                    }
                  : msg
              )
            );
          }
        }
      }, 4000);
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "loading-visuals"
            ? {
                ...msg,
                isLoading: false,
                isError: true,
                content:
                  "❌ Failed to start visual generation. Tap Retry to try again.",
                onRetry: () => triggerVisualGeneration(currentWorkflowData),
              }
            : msg
        )
      );
    }
  };

  const handleCarouselSubmit = (inputValue: string) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: inputValue }));
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

  const handleSkip = () => {
    if (currentQuestion && currentQuestion.required === false) {
      dispatch(submitStep({ key: currentQuestion.key, value: null }));
    }
  };

  const isCarouselInputDisabled =
    phaseStatus === "awaiting-api-call" || currentQuestion?.type === "select";

  const isCurrentQuestionOptional = currentQuestion?.required === false;

  return {
    handleCarouselSubmit,
    handleCarouselOptionSelect,
    isCarouselInputDisabled,
    handleSkip,
    isCurrentQuestionOptional,
  };
};
