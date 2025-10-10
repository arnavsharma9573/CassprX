import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux-hooks";
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
import { Message } from "@/components/dashboard/workspace/ChatInterfaceWorkspace";
import { streamMessage } from "@/lib/helper";

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
    if (activeSubTask === "PRESET" && !apiResult) {
      getPhotographyPresets().then((presets) => {
        dispatch(storeApiResult({ presets }));
      });
    }
  }, [activeSubTask, apiResult, dispatch]);

  useEffect(() => {
    if (activeSubTask !== "PRESET") return;

    if (phaseStatus === "in-progress" && currentQuestion) {
      const questionId = `q-${currentPhaseIndex}-${currentStepIndex}`;
      const questionAlreadyAsked = messages.some(
        (msg) => msg.id === questionId
      );

      if (!questionAlreadyAsked) {
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
    } else if (
      phaseStatus === "in-progress" &&
      currentPhase &&
      currentStepIndex >= currentPhase.steps.length
    ) {
      dispatch(completePhase());
    } else if (
      phaseStatus === "in-progress" &&
      !currentQuestion &&
      currentPhase
    ) {
      dispatch(submitStep({ key: "skipped", value: null }));
    }

    if (phaseStatus === "awaiting-api-call") {
      triggerPresetTransform();
    }
  }, [
    activeSubTask,
    phaseStatus,
    currentQuestion,
    currentPhase,
    currentStepIndex,
    dispatch,
    setMessages,
    apiResult,
    messages,
  ]);

  const triggerPresetTransform = async () => {
    setIsLoading(true);
    await new Promise<void>((resolve) =>
      streamMessage(
        "preset-start",
        "Generating a detailed prompt based on your selections...",
        setMessages,
        resolve
      )
    );
    try {
      const promptResult = await generatePhotographyPrompt({
        product_name: workflowData.product_name,
        photography_type: workflowData.photography_type,
        background_color: workflowData.background_color,
      });

      await new Promise<void>((resolve) =>
        streamMessage(
          "preset-transform",
          "Prompt generated! Now transforming your image...",
          setMessages,
          resolve
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
          if (job.status === "completed" && job.result?.image_url) {
            setMessages((prev) => [
              ...prev,
              {
                id: "preset-complete",
                role: "assistant",
                content: "Your transformed image is ready!",
                imageUrl: job.result.image_url,
                timestamp: new Date(),
              },
            ]);
            dispatch(resetWorkflow());
          } else {
            streamMessage(
              "preset-error",
              "Sorry, the image transformation failed.",
              setMessages
            );
          }
        }
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      streamMessage(
        "preset-error-start",
        "Something went wrong during the process. Please try again.",
        setMessages
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
