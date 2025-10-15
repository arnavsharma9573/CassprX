import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  selectActiveWorkflow,
  resetWorkflow,
  submitStep,
  startNextPhase,
  jumpToPhase,
} from "@/store/feature/workflowSlice";
import { v4 as uuidv4 } from "uuid";
import {
  generateXPost,
  generateXInteraction,
} from "@/lib/workspace/text-generation/xApiLogic";
import { Brand } from "@/store/feature/brandSlice";
import { Message } from "@/types/common";
import {
  copywriterWorkflows,
  xGenerateWorkflow,
  xInteractWorkflow,
} from "@/lib/workspace/text-generation/copywriterFlows";

interface UseXWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceActiveBrand: Brand | undefined;
}

export const useXWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
  workspaceActiveBrand,
}: UseXWorkflowProps) => {
  const dispatch = useAppDispatch();
  const {
    activeSubTask,
    currentPhaseIndex,
    currentStepIndex,
    taskData,
    phaseStatus,
  } = useAppSelector(selectActiveWorkflow);

  const [xMode, setXMode] = useState<"generate" | "interact" | null>(null);
  const hasStartedRef = useRef(false);

  const activeWorkflow =
    xMode === "generate" ? xGenerateWorkflow : xInteractWorkflow;

  const performApiCall = useCallback(
    async (messageId: string) => {
      if (!workspaceActiveBrand) return;
      setIsLoading(true);

      try {
        let result;
        if (xMode === "generate") {
          result = await generateXPost(taskData, workspaceActiveBrand);
        } else {
          result = await generateXInteraction(taskData, workspaceActiveBrand);
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  isLoading: false,
                  isError: false,
                  type: "x_result", // Type ko 'x_result' set karo
                  content: "I've generated a few options for your Tweet.",
                  resultData: result.data,
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
    [taskData, workspaceActiveBrand, xMode, dispatch, setMessages, setIsLoading]
  );

  const askQuestion = () => {
    if (!xMode) {
      const initialStep = copywriterWorkflows.X[0].steps[0];
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: initialStep.question,
          timestamp: new Date(),
          type: initialStep.type,
          options: initialStep.options,
        },
      ]);
      return;
    }

    const phase = activeWorkflow.find((p) => p.phase === currentPhaseIndex);
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
          content: `Crafting your X ${xMode}...`,
          timestamp: new Date(),
          isLoading: true,
        },
      ]);
      performApiCall(loadingMessageId);
    }
  };

  useEffect(() => {
    if (
      activeSubTask === "X" &&
      Object.keys(taskData).length === 0 &&
      !hasStartedRef.current
    ) {
      askQuestion();
      hasStartedRef.current = true;
    }
  }, [activeSubTask, taskData]);

  useEffect(() => {
    if (xMode && hasStartedRef.current) askQuestion();
  }, [xMode]);
  useEffect(() => {
    if (activeSubTask !== "X") return;
    if (hasStartedRef.current && xMode && currentStepIndex > 0) askQuestion();
  }, [currentStepIndex, activeSubTask, xMode]);
  useEffect(() => {
    if (activeSubTask !== "X") return;
    if (
      phaseStatus === "in-progress" &&
      currentStepIndex === 0 &&
      currentPhaseIndex > 0
    )
      askQuestion();
  }, [currentPhaseIndex, phaseStatus, activeSubTask]);
  useEffect(() => {
    if (activeSubTask !== "X") {
      hasStartedRef.current = false;
      setXMode(null);
    }
  }, [activeSubTask]);

  const processStep = (value: string | null) => {
    if (!xMode) {
      if (value === "Generate a new Tweet") setXMode("generate");
      else if (value === "Interact with a Tweet") setXMode("interact");
      return;
    }
    const key = activeWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.key;
    if (key) dispatch(submitStep({ key, value }));
  };

  const isInputDisabled = xMode
    ? activeWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.type ===
      "select"
    : false;
  const isCurrentQuestionOptional = xMode
    ? !!activeWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.isOptional
    : false;

  return { processStep, isInputDisabled, isCurrentQuestionOptional };
};
