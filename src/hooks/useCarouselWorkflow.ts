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

  const triggerIdeaGeneration = () => {
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
  };

  const triggerFramePromptGeneration = async () => {
    setIsLoading(true);
    await new Promise<void>((resolve) =>
      streamMessage(
        "gen-prompts-thinking",
        "Perfect! Generating the text for each frame...",
        setMessages,
        resolve
      )
    );
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
      for (let i = 0; i < framePrompts.length; i++) {
        const prompt = framePrompts[i];
        await new Promise<void>((resolve) =>
          streamMessage(`show-prompt-${i}`, prompt, setMessages, resolve)
        );
        await sleep(1000);
      }
      dispatch(startNextPhase({ newData: { frame_prompts: framePrompts } }));
    } catch (error) {
      streamMessage(
        "err-prompts",
        "Sorry, I had trouble generating the frame prompts.",
        setMessages
      );
    } finally {
      setIsLoading(false);
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

  const triggerVisualGeneration = async (
    currentWorkflowData: Record<string, any>
  ) => {
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

      const shouldGenerateImages =
        currentWorkflowData.generate_images?.trim() === "Generate Images";

      const { jobId } = await startVisualGeneration(
        currentWorkflowData.frame_prompts,
        brandGuidelines,
        shouldGenerateImages
      );

      await new Promise<void>((resolve) =>
        streamMessage(
          "job-start",
          `Your carousel is being created! Job ID: ${jobId}.`,
          setMessages,
          resolve
        )
      );

      const pollInterval = setInterval(async () => {
        const job = await pollCarouselJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);

          // This is the corrected success/failure logic
          if (
            job.status === "completed" &&
            job.result?.image_urls &&
            job.result.image_urls.length > 0
          ) {
            // SUCCESS: Create a message object with the imageUrls array
            setMessages((prev) => [
              ...prev,
              {
                id: "job-end",
                role: "assistant",
                content: "Your carousel is ready!",
                imageUrls: job.result.image_urls, // Pass the array of URLs here
                timestamp: new Date(),
              },
            ]);
            dispatch(resetWorkflow());
          } else {
            // FAILURE: Stream an error message
            streamMessage(
              "job-end",
              "Sorry, something went wrong and the images could not be generated.",
              setMessages,
              () => {
                dispatch(resetWorkflow());
              }
            );
          }
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
  const isCurrentQuestionOptional = currentQuestion?.required === false;

  return {
    handleCarouselSubmit,
    handleCarouselOptionSelect,
    isCarouselInputDisabled,
    handleSkip,
    isCurrentQuestionOptional,
  };
};
