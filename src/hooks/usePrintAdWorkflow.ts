import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux-hooks";
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
import { Message } from "@/components/dashboard/workspace/ChatInterfaceWorkspace";
import { streamMessage } from "@/lib/helper";

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

  const currentFlow =
    activeSubTask === "PRINT_AD" ? contentCreatorFlows[activeSubTask] : null;
  const currentPhase = currentFlow
    ? currentFlow.phases[currentPhaseIndex]
    : null;
  const currentQuestion = currentPhase
    ? currentPhase.steps[currentStepIndex]
    : null;

  // In hooks/usePrintAdWorkflow.ts

  useEffect(() => {
    if (activeSubTask !== "PRINT_AD" || !currentQuestion) return;

    const questionId = `q-${currentPhaseIndex}-${currentStepIndex}`;
    const questionAlreadyAsked = messages.some((msg) => msg.id === questionId);

    if (!questionAlreadyAsked) {
      // Create a variable that is guaranteed to be the correct type (string[] | undefined)
      let finalOptions: string[] | undefined;

      // This logic ensures we only pass a valid array to the Message object
      if (Array.isArray(currentQuestion.options)) {
        finalOptions = currentQuestion.options;
      }

      streamMessage(questionId, currentQuestion.question, setMessages, () => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === questionId
              ? { ...msg, options: finalOptions, type: currentQuestion.type }
              : msg
          )
        );
      });
    }
  }, [
    activeSubTask,
    currentQuestion,
    currentPhaseIndex,
    currentStepIndex,
    setMessages,
    messages,
  ]);

  const triggerAdGeneration = async () => {
    setIsLoading(true);
    await new Promise<void>((resolve) =>
      streamMessage(
        "ad-start",
        "Thank you! I have all the details. Generating your print ad creatives now...",
        setMessages,
        resolve
      )
    );

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
        }, // Assuming fixed dimensions
        ad_specific: {
          distribution_context: workflowData.distribution_context,
        },
        ad_copy: {
          headline: workflowData.headline,
          body: workflowData.body_copy,
        },
        creative_requirements: { has_creative_requirements: false }, // Assuming false for this flow
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
      await new Promise<void>((resolve) =>
        streamMessage(
          "ad-polling",
          `Your job has started (ID: ${jobId}). I'll let you know when the ads are ready.`,
          setMessages,
          resolve
        )
      );

      const pollInterval = setInterval(async () => {
        const job = await pollPrintAdJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          if (job.status === "completed" && job.result) {
            setMessages((prev) => [
              ...prev,
              {
                id: "ad-complete",
                role: "assistant",
                content: "Your print ad creatives are ready!",
                imageUrl: job.result.ai_optimized_image_url,
                timestamp: new Date(),
              },
            ]);
            if (job.result.user_instructed_image_url) {
              setMessages((prev) => [
                ...prev,
                {
                  id: "ad-complete-2",
                  role: "assistant",
                  content: "",
                  imageUrl: job.result.user_instructed_image_url,
                  timestamp: new Date(),
                },
              ]);
            }
            dispatch(resetWorkflow());
          } else {
            streamMessage(
              "ad-error",
              "Sorry, something went wrong while creating the ads.",
              setMessages
            );
          }
        }
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      streamMessage(
        "ad-error-start",
        "I couldn't start the print ad generation job. Please try again.",
        setMessages
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

  const isInputDisabled = currentQuestion?.type === "file";
  const isCurrentQuestionOptional = currentQuestion?.required === false;

  return { handleSubmit, handleFileSubmit, handleSkip, isInputDisabled,isCurrentQuestionOptional };
};
