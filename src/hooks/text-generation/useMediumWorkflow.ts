import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  selectActiveWorkflow,
  resetWorkflow,
  submitStep,
} from "@/store/feature/workflowSlice";
import { v4 as uuidv4 } from "uuid";
import { generateMediumArticle } from "@/lib/workspace/text-generation/mediumApiLogic";
import { Brand } from "@/store/feature/brandSlice";
import { Message } from "@/types/common";
import { copywriterWorkflows } from "@/lib/workspace/text-generation/copywriterFlows";

interface UseMediumWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceActiveBrand: Brand | undefined;
}

export const useMediumWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
  workspaceActiveBrand,
}: UseMediumWorkflowProps) => {
  const dispatch = useAppDispatch();
  const {
    activeSubTask,
    currentPhaseIndex,
    currentStepIndex,
    taskData,
    phaseStatus,
  } = useAppSelector(selectActiveWorkflow);

  const hasStartedRef = useRef(false);
  const mediumWorkflow = copywriterWorkflows.MEDIUM;

  const performApiCall = useCallback(
    async (messageId: string) => {
      if (!workspaceActiveBrand) return;
      setIsLoading(true);

      try {
        const result = await generateMediumArticle(
          taskData,
          workspaceActiveBrand
        );
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  isLoading: false,
                  isError: false,
                  type: "medium_result",
                  content: `I've generated your Medium article: "${result.data?.[0]?.title}"`,
                  resultData: result.data?.[0],
                }
              : m
          )
        );
        setTimeout(() => dispatch(resetWorkflow()), 500);
      } catch (error) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  isLoading: false,
                  isError: true,
                  content: "Sorry, an error occurred.",
                  onRetry: () => performApiCall(messageId),
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [taskData, workspaceActiveBrand, dispatch, setMessages, setIsLoading]
  );

  const askQuestion = () => {
    const phase = mediumWorkflow.find((p) => p.phase === currentPhaseIndex);
    const step = phase?.steps[currentStepIndex];

    if (step) {
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: step.question,
          timestamp: new Date(),
          type: step.type,
          options: step.options,
        },
      ]);
    } else {
      const loadingMessageId = uuidv4();
      setMessages((prev) => [
        ...prev,
        {
          id: loadingMessageId,
          role: "assistant",
          content: "Crafting your Medium article...",
          timestamp: new Date(),
          isLoading: true,
        },
      ]);
      performApiCall(loadingMessageId);
    }
  };

  useEffect(() => {
    if (
      activeSubTask === "MEDIUM" &&
      Object.keys(taskData).length === 0 &&
      !hasStartedRef.current
    ) {
      askQuestion();
      hasStartedRef.current = true;
    }
  }, [activeSubTask, taskData]);

  useEffect(() => {
    if (activeSubTask !== "MEDIUM") return;
    if (hasStartedRef.current && currentStepIndex > 0) askQuestion();
  }, [currentStepIndex, activeSubTask]);

  useEffect(() => {
    if (activeSubTask !== "MEDIUM") hasStartedRef.current = false;
  }, [activeSubTask]);

  const processStep = (value: string | null) => {
    const key = mediumWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.key;
    if (key) dispatch(submitStep({ key, value }));
  };

  const isInputDisabled =
    mediumWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.type ===
    "select";
  const isCurrentQuestionOptional =
    !!mediumWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.isOptional;

  return { processStep, isInputDisabled, isCurrentQuestionOptional };
};
