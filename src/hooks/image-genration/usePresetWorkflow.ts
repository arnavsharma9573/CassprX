import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import {
  selectActiveWorkflow,
  selectWorkflowTaskData,
  submitStep,
  completePhase,
  storeApiResult,
  resetWorkflow,
} from "@/store/feature/workflowSlice";
import {
  getPhotographyPresets,
  generatePhotographyPrompt,
  startPhotographyTransformJob,
  pollPhotographyJobStatus,
} from "@/lib/workspace/photographyApiLogic";
import { contentCreatorFlows } from "@/lib/workspace/contentCreatorFlows";
import { streamMessage } from "@/lib/helper";
import { Message } from "@/types/common";

interface PresetWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePresetWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
}: PresetWorkflowProps) => {
  const dispatch = useAppDispatch();
  const workflowData = useAppSelector(selectWorkflowTaskData);
  const {
    activeSubTask,
    currentPhaseIndex,
    currentStepIndex,
    phaseStatus,
    apiResult,
  } = useAppSelector(selectActiveWorkflow);

  const processedActionsRef = useRef(new Set());

  const currentFlow =
    activeSubTask === "PRESET" ? contentCreatorFlows[activeSubTask] : null;
  const currentPhase = currentFlow
    ? currentFlow.phases[currentPhaseIndex]
    : null;
  let currentQuestion = currentPhase
    ? currentPhase.steps[currentStepIndex]
    : null;

  if (
    currentQuestion?.dependsOn &&
    workflowData[currentQuestion.dependsOn.key] !==
      currentQuestion.dependsOn.value
  ) {
    currentQuestion = null;
  }

  useEffect(() => {
    if (activeSubTask !== "PRESET") {
      processedActionsRef.current.clear();
      return;
    }
  }, [activeSubTask]);

  useEffect(() => {
    if (activeSubTask === "PRESET" && !apiResult) {
      getPhotographyPresets().then((presets) => {
        dispatch(storeApiResult({ presets }));
      });
    }
  }, [activeSubTask, apiResult, dispatch]);

  useEffect(() => {
    if (activeSubTask !== "PRESET") return;

    const actionId = `p${currentPhaseIndex}-s${currentStepIndex}-${phaseStatus}`;
    if (processedActionsRef.current.has(actionId)) {
      return;
    }

    if (phaseStatus === "in-progress" && currentQuestion) {
      let finalOptions: string[] | undefined;
      if (
        currentQuestion.options === "dynamic_photo_types" &&
        apiResult?.presets
      ) {
        finalOptions = Object.values(apiResult.presets.photography_types);
      } else if (
        currentQuestion.options === "dynamic_tint_colors" &&
        apiResult?.presets
      ) {
        finalOptions = apiResult.presets.tint_colors;
      } else if (Array.isArray(currentQuestion.options)) {
        finalOptions = currentQuestion.options;
      }

      streamMessage(actionId, currentQuestion.question, setMessages, () => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === actionId
              ? { ...msg, options: finalOptions, type: currentQuestion.type }
              : msg
          )
        );
      });
      processedActionsRef.current.add(actionId);
    } else if (
      phaseStatus === "in-progress" &&
      currentPhase &&
      currentStepIndex >= currentPhase.steps.length
    ) {
      dispatch(completePhase());
      processedActionsRef.current.add(actionId);
    } else if (
      phaseStatus === "in-progress" &&
      !currentQuestion &&
      currentPhase
    ) {
      dispatch(submitStep({ key: "skipped", value: null }));
      processedActionsRef.current.add(actionId);
    } else if (phaseStatus === "awaiting-api-call") {
      triggerPresetTransform();
      processedActionsRef.current.add(actionId);
    }
  }, [
    activeSubTask,
    phaseStatus,
    currentQuestion,
    currentPhase,
    currentStepIndex,
    dispatch,
    apiResult,
    messages,
  ]);

  const triggerPresetTransform = async () => {
    const messageId = "loading-preset";
    setIsLoading(true);
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== messageId),
      {
        id: messageId,
        role: "assistant",
        content: "Generating a detailed prompt...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);

    try {
      const promptResult = await generatePhotographyPrompt({
        product_name: workflowData.product_name,
        photography_type: workflowData.photography_type,
        background_color: workflowData.background_color,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content: "Prompt generated! Transforming your image...",
              }
            : msg
        )
      );

      const { jobId } = await startPhotographyTransformJob(
        promptResult.prompt,
        workflowData.source_image
      );

      const pollInterval = setInterval(async () => {
        const job = await pollPhotographyJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          setMessages((prev) => prev.filter((m) => m.id !== messageId));

          if (job.status === "completed" && job.result?.image_url) {
            setMessages((prev) => [
              ...prev,
              {
                id: "preset-complete",
                role: "assistant",
                content: "Your transformed image is ready!",
                imageUrls: [job.result.image_url],
                timestamp: new Date(),
              },
            ]);
            dispatch(resetWorkflow());
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: "preset-error",
                role: "assistant",
                content:
                  "❌ Sorry, the image transformation failed. Tap to try again.",
                isError: true,
                onRetry: triggerPresetTransform,
                timestamp: new Date(),
              },
            ]);
          }
        }
      }, 3000);
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
                  "❌ Something went wrong during the process. Tap to try again.",
                onRetry: triggerPresetTransform,
              }
            : msg
        )
      );
    }
  };

  const handleSubmit = (inputValue: string) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: inputValue }));
    }
  };

  const handleOptionSelect = (option: string) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: option }));
    }
  };

  const handleFileSubmit = (file: File) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: file }));
    }
  };

  const isInputDisabled =
    currentQuestion?.type === "select" || currentQuestion?.type === "file";

  return {
    handleSubmit,
    handleOptionSelect,
    handleFileSubmit,
    isInputDisabled,
  };
};
