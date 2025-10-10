import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux-hooks";
import {
  selectActiveWorkflow,
  selectWorkflowTaskData,
  submitStep,
  resetWorkflow,
} from "@/store/feature/workflowSlice";
import {
  startMemeGenerationJob,
  pollMemeJobStatus,
  MemeGenerationInputs,
} from "@/lib/workspace/memeApiLogic";
import { contentCreatorFlows } from "@/lib/workspace/contentCreatorFlows";
import { Message } from "@/components/dashboard/workspace/ChatInterfaceWorkspace";
import { streamMessage } from "@/lib/helper";

interface MemeWorkflowProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMemeWorkflow = ({
  setMessages,
  setIsLoading,
}: MemeWorkflowProps) => {
  const dispatch = useAppDispatch();
  const workflowData = useAppSelector(selectWorkflowTaskData);
  const { activeSubTask, currentPhaseIndex, currentStepIndex } =
    useAppSelector(selectActiveWorkflow);

  const currentFlow =
    activeSubTask === "MEME" ? contentCreatorFlows[activeSubTask] : null;
  const currentPhase = currentFlow
    ? currentFlow.phases[currentPhaseIndex]
    : null;
  const currentQuestion = currentPhase
    ? currentPhase.steps[currentStepIndex]
    : null;

  useEffect(() => {
    if (activeSubTask !== "MEME" || !currentQuestion) return;

    const questionId = `q-${currentPhaseIndex}-${currentStepIndex}`;
    const questionAlreadyAsked = document.getElementById(questionId);

    if (!questionAlreadyAsked) {
      streamMessage(questionId, currentQuestion.question, setMessages, () => {
        const finalOptions: string[] | undefined = Array.isArray(
          currentQuestion.options
        )
          ? currentQuestion.options
          : undefined;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === questionId
              ? {
                  ...msg,
                  options: finalOptions,
                  type: currentQuestion.type,
                }
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
  ]);

  const triggerMemeGeneration = async () => {
    setIsLoading(true);
    await new Promise<void>((resolve) =>
      streamMessage(
        "meme-start",
        "Got it! Firing up the meme factory...",
        setMessages,
        resolve
      )
    );

    try {
      const memeInputs: MemeGenerationInputs = {
        text: workflowData.text,
        art_style: workflowData.art_style,
        logo_desc: workflowData.logo_desc,
        mascot_desc: workflowData.mascot_desc,
        product_desc: workflowData.product_desc,
      };

      const { jobId } = await startMemeGenerationJob(memeInputs);
      await new Promise<void>((resolve) =>
        streamMessage(
          "meme-polling",
          `Your meme is being generated! I'll check on its progress. Job ID: ${jobId}`,
          setMessages,
          resolve
        )
      );

      const pollInterval = setInterval(async () => {
        const job = await pollMemeJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          if (job.status === "completed" && job.result?.image_url) {
            setMessages((prev) => [
              ...prev,
              {
                id: "meme-complete",
                role: "assistant",
                content: "Fresh from the oven! Here is your meme.",
                imageUrl: job.result.image_url,
                timestamp: new Date(),
              },
            ]);
            dispatch(resetWorkflow());
          } else {
            streamMessage(
              "meme-error",
              "Sorry, something went wrong while creating the meme.",
              setMessages
            );
          }
        }
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      streamMessage(
        "meme-error-start",
        "I couldn't start the meme generation job. Please try again.",
        setMessages
      );
    }
  };

  const handleSkip = () => {
    if (currentQuestion && currentQuestion.required === false) {
      // Dispatch the step with a null value to indicate it was skipped
      dispatch(submitStep({ key: currentQuestion.key, value: null }));

      // Check if this was the last step to trigger generation
      const isLastStep =
        currentPhase && currentStepIndex + 1 >= currentPhase.steps.length;
      if (isLastStep) {
        triggerMemeGeneration();
      }
    }
  };

  const isCurrentQuestionOptional = currentQuestion?.required === false;

  const handleMemeSubmit = (inputValue: string) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: inputValue }));
    }
    const isLastStep =
      currentPhase && currentStepIndex + 1 >= currentPhase.steps.length;
    if (isLastStep) {
      triggerMemeGeneration();
    }
  };

  const handleMemeFileSubmit = (file: File) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: file }));

      const isLastStep =
        currentPhase && currentStepIndex + 1 >= currentPhase.steps.length;
      if (isLastStep) {
        triggerMemeGeneration();
      }
    }
  };

  const handleMemeOptionSelect = (option: string) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: option }));
    }
    const isLastStep =
      currentPhase && currentStepIndex + 1 >= currentPhase.steps.length;
    if (isLastStep) {
      triggerMemeGeneration();
    }
  };

  const isMemeInputDisabled = currentQuestion?.type === "select";

  return {
    handleMemeSubmit,
    handleMemeOptionSelect,
    isMemeInputDisabled,
    isCurrentQuestionOptional,
    handleSkip,
    handleMemeFileSubmit,
  };
};
