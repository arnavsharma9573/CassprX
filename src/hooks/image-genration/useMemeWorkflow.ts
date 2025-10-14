import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import {
  selectActiveWorkflow,
  selectWorkflowTaskData,
  submitStep,
  resetWorkflow,
  completePhase,
} from "@/store/feature/workflowSlice";
import {
  startMemeGenerationJob,
  pollMemeJobStatus,
  MemeGenerationInputs,
} from "@/lib/workspace/memeApiLogic";
import { contentCreatorFlows } from "@/lib/workspace/contentCreatorFlows";
import { streamMessage } from "@/lib/helper";
import { Message } from "@/types/common";

interface MemeWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMemeWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
}: MemeWorkflowProps) => {
  const dispatch = useAppDispatch();
  const workflowData = useAppSelector(selectWorkflowTaskData);
  const { activeSubTask, currentPhaseIndex, currentStepIndex, phaseStatus } =
    useAppSelector(selectActiveWorkflow);

  const processedActionsRef = useRef(new Set());

  const currentFlow =
    activeSubTask === "MEME" ? contentCreatorFlows[activeSubTask] : null;
  const currentPhase = currentFlow
    ? currentFlow.phases[currentPhaseIndex]
    : null;
  const currentQuestion = currentPhase
    ? currentPhase.steps[currentStepIndex]
    : null;

  useEffect(() => {
    if (activeSubTask !== "MEME") {
      processedActionsRef.current.clear();
      return;
    }
  }, [activeSubTask]);

  useEffect(() => {
    if (activeSubTask !== "MEME") return;

    const actionId = `p${currentPhaseIndex}-s${currentStepIndex}-${phaseStatus}`;
    if (processedActionsRef.current.has(actionId)) {
      return;
    }

    if (phaseStatus === "in-progress" && currentQuestion) {
      streamMessage(actionId, currentQuestion.question, setMessages, () => {
        const finalOptions: string[] | undefined = Array.isArray(
          currentQuestion.options
        )
          ? currentQuestion.options
          : undefined;
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
      !currentQuestion
    ) {
      dispatch(completePhase());
      processedActionsRef.current.add(actionId);
    } else if (phaseStatus === "awaiting-api-call") {
      triggerMemeGeneration();
      processedActionsRef.current.add(actionId);
    }
  }, [
    activeSubTask,
    phaseStatus,
    currentPhaseIndex,
    currentStepIndex,
    workflowData,
    messages,
  ]);

  const triggerMemeGeneration = async () => {
    const messageId = "loading-meme";
    setIsLoading(true);
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== messageId),
      {
        id: messageId,
        role: "assistant",
        content: "Got it! Firing up the meme factory...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);

    try {
      const memeInputs: MemeGenerationInputs = {
        text: workflowData.text,
        art_style: workflowData.art_style,
        logo_desc: workflowData.logo_desc,
        mascot_desc: workflowData.mascot_desc,
        product_desc: workflowData.product_desc,
        logo_file: workflowData.logo_file,
        mascot_file: workflowData.mascot_file,
        product_file: workflowData.product_file,
      };

      const { jobId } = await startMemeGenerationJob(memeInputs);
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
        const job = await pollMemeJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          setMessages((prev) => prev.filter((m) => m.id !== messageId));

          if (job.status === "completed" && job.result?.image_url) {
            setMessages((prev) => [
              ...prev,
              {
                id: "meme-complete",
                role: "assistant",
                content: "Fresh from the oven! Here is your meme.",
                imageUrls: [job.result.image_url],
                timestamp: new Date(),
              },
            ]);
            dispatch(resetWorkflow());
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: "meme-error",
                role: "assistant",
                content:
                  "❌ Sorry, something went wrong while creating the meme. Tap to try again.",
                isError: true,
                onRetry: triggerMemeGeneration,
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
                  "❌ I couldn't start the meme generation job. Tap to try again.",
                onRetry: triggerMemeGeneration,
              }
            : msg
        )
      );
    }
  };

  const handleSkip = () => {
    if (currentQuestion && currentQuestion.required === false) {
      // First, dispatch the skip for the current text question
      dispatch(submitStep({ key: currentQuestion.key, value: null }));

      // Now, look ahead to the next question
      const nextStepIndex = currentStepIndex + 1;
      if (currentPhase && nextStepIndex < currentPhase.steps.length) {
        const nextQuestion = currentPhase.steps[nextStepIndex];
        const currentKey = currentQuestion.key; // e.g., 'logo_desc'
        const nextKey = nextQuestion.key; // e.g., 'logo_file'

        // Check if this is a paired 'description' and 'file' question
        if (
          currentKey.endsWith("_desc") &&
          nextKey === currentKey.replace("_desc", "_file")
        ) {
          // If it's a match, automatically skip the file upload question too
          dispatch(submitStep({ key: nextKey, value: null }));
        }
      }

      // Check if this action completes the workflow
      const isNowLastStep =
        currentPhase && currentStepIndex + 2 >= currentPhase.steps.length;
      if (isNowLastStep) {
        triggerMemeGeneration();
      }
    }
  };

  const handleMemeSubmit = (inputValue: string) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: inputValue }));
    }
  };

  const handleMemeFileSubmit = (file: File) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: file }));
    }
  };

  const handleMemeOptionSelect = (option: string) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: option }));
    }
  };

  const isMemeInputDisabled =
    phaseStatus === "awaiting-api-call" ||
    currentQuestion?.type === "select" ||
    currentQuestion?.type === "file";
  const isCurrentQuestionOptional = currentQuestion?.required === false;

  return {
    handleMemeSubmit,
    handleMemeOptionSelect,
    isMemeInputDisabled,
    isCurrentQuestionOptional,
    handleSkip,
    handleMemeFileSubmit,
  };
};
