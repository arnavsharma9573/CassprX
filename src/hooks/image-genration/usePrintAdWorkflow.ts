import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import {
  selectActiveWorkflow,
  selectWorkflowTaskData,
  submitStep,
  resetWorkflow,
} from "@/store/feature/workflowSlice";
import {
  startPrintAdGenerationJob,
  pollPrintAdJobStatus,
  CampaignData,
} from "@/lib/workspace/printAdApiLogic";
import { contentCreatorFlows } from "@/lib/workspace/contentCreatorFlows";
import { streamMessage } from "@/lib/helper";
import { Message } from "@/types/common";

interface PrintAdWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePrintAdWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
}: PrintAdWorkflowProps) => {
  const dispatch = useAppDispatch();
  const workflowData = useAppSelector(selectWorkflowTaskData);
  const { activeSubTask, currentPhaseIndex, currentStepIndex } =
    useAppSelector(selectActiveWorkflow);

  const processedActionsRef = useRef(new Set());

  const currentFlow =
    activeSubTask === "PRINT_AD" ? contentCreatorFlows[activeSubTask] : null;
  const currentPhase = currentFlow
    ? currentFlow.phases[currentPhaseIndex]
    : null;
  const currentQuestion = currentPhase
    ? currentPhase.steps[currentStepIndex]
    : null;

  useEffect(() => {
    if (activeSubTask !== "PRINT_AD") {
      processedActionsRef.current.clear();
      return;
    }

    const actionId = `p${currentPhaseIndex}-s${currentStepIndex}`;
    if (processedActionsRef.current.has(actionId) || !currentQuestion) {
      return;
    }

    streamMessage(actionId, currentQuestion.question, setMessages, () => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === actionId ? { ...msg, type: currentQuestion.type } : msg
        )
      );
    });
    processedActionsRef.current.add(actionId);
  }, [
    activeSubTask,
    currentQuestion,
    currentPhaseIndex,
    currentStepIndex,
    messages,
  ]);

  const triggerAdGeneration = async () => {
    const messageId = "loading-ad";
    setIsLoading(true);
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== messageId),
      {
        id: messageId,
        role: "assistant",
        content: "Generating your print ad creatives...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);

    try {
      const campaignData: CampaignData = {
        common_info: {
          name: workflowData.campaign_name,
          brand_name: workflowData.brand_name,
          objective: workflowData.objective,
          key_message: workflowData.key_message,
          call_to_action: workflowData.call_to_action,
          target_audience: workflowData.target_audience,
        },
        ad_type: { name: workflowData.ad_type_name, category: "Print Media" },
        format: {
          aspect_ratio: workflowData.aspect_ratio,
          dimensions: "1024x1024",
        },
        ad_specific: {
          distribution_context: workflowData.distribution_context,
        },
        ad_copy: {
          headline: workflowData.headline,
          body: workflowData.body_copy,
        },
        creative_requirements: { has_creative_requirements: false },
      };

      const formData = new FormData();
      formData.append("campaign_data", JSON.stringify(campaignData));
      formData.append(
        "brand_guidelines_file",
        workflowData.brand_guidelines_file
      );
      if (workflowData.logo_file)
        formData.append("logo_file", workflowData.logo_file);
      if (workflowData.mascot_file)
        formData.append("mascot_file", workflowData.mascot_file);
      if (workflowData.product_file)
        formData.append("product_file", workflowData.product_file);

      const { jobId } = await startPrintAdGenerationJob(formData);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: `Job started Polling for results...`,
              }
            : msg
        )
      );

      const pollInterval = setInterval(async () => {
        const job = await pollPrintAdJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          setMessages((prev) => prev.filter((m) => m.id !== messageId));

          if (job.status === "completed" && job.result) {
            const generatedImages: string[] = [];
            if (job.result.ai_optimized_image_url) {
              generatedImages.push(job.result.ai_optimized_image_url);
            }
            if (job.result.user_instructed_image_url) {
              generatedImages.push(job.result.user_instructed_image_url);
            }

            if (generatedImages.length > 0) {
              setMessages((prev) => [
                ...prev,
                {
                  id: "ad-complete",
                  role: "assistant",
                  content: "Your print ad creatives are ready!",
                  imageUrls: generatedImages,
                  timestamp: new Date(),
                },
              ]);
              dispatch(resetWorkflow());
            } else {
              setMessages((prev) => [
                ...prev,
                {
                  id: "ad-error-no-img",
                  role: "assistant",
                  content:
                    "❌ The job completed, but no images were generated. Tap to try again.",
                  isError: true,
                  onRetry: triggerAdGeneration,
                  timestamp: new Date(),
                },
              ]);
            }
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: "ad-error",
                role: "assistant",
                content:
                  "❌ Sorry, something went wrong while creating the ads. Tap to try again.",
                isError: true,
                onRetry: triggerAdGeneration,
                timestamp: new Date(),
              },
            ]);
          }
        }
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                isLoading: false,
                isError: true,
                content:
                  "❌ I couldn't start the print ad generation job. Tap to try again.",
                onRetry: triggerAdGeneration,
              }
            : msg
        )
      );
    }
  };

  const checkAndTrigger = () => {
    const isLastStep =
      currentPhase && currentStepIndex + 1 >= currentPhase.steps.length;
    if (isLastStep) {
      triggerAdGeneration();
    }
  };

  const handleSubmit = (inputValue: string) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: inputValue }));
      checkAndTrigger();
    }
  };

  const handleFileSubmit = (file: File) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: file }));
      checkAndTrigger();
    }
  };

  const handleSkip = () => {
    if (currentQuestion && currentQuestion.required === false) {
      dispatch(submitStep({ key: currentQuestion.key, value: null }));
      checkAndTrigger();
    }
  };

  const isInputDisabled =
    currentQuestion?.type === "file" || currentQuestion?.type === "select";
  const isCurrentQuestionOptional = currentQuestion?.required === false;

  return {
    handleSubmit,
    handleFileSubmit,
    handleSkip,
    isInputDisabled,
    isCurrentQuestionOptional,
  };
};
