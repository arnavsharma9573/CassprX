import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  selectActiveWorkflow,
  resetWorkflow,
  submitStep,
  jumpToPhase,
  startNextPhase,
} from "@/store/feature/workflowSlice";
import { v4 as uuidv4 } from "uuid";
import {
  generateThreadsPost,
  generateThreadsInteraction,
} from "@/lib/workspace/text-generation/threadsApiLogic";
import { Brand } from "@/store/feature/brandSlice";
import { Message } from "@/types/common";
import {
  copywriterWorkflows,
  threadsGenerateWorkflow,
  threadsInteractWorkflow,
} from "@/lib/workspace/text-generation/copywriterFlows";

interface UseThreadsWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceActiveBrand: Brand | undefined;
}

export const useThreadsWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
  workspaceActiveBrand,
}: UseThreadsWorkflowProps) => {
  const dispatch = useAppDispatch();
  const {
    activeSubTask,
    currentPhaseIndex,
    currentStepIndex,
    taskData,
    phaseStatus,
  } = useAppSelector(selectActiveWorkflow);

  const [threadsMode, setThreadsMode] = useState<
    "generate" | "interact" | null
  >(null);
  const hasStartedRef = useRef(false);

  const activeWorkflow =
    threadsMode === "generate"
      ? threadsGenerateWorkflow
      : threadsInteractWorkflow;

  const performApiCall = useCallback(
    async (messageId: string) => {
      if (!workspaceActiveBrand) return;
      setIsLoading(true);
      try {
        let result;
        if (threadsMode === "generate") {
          result = await generateThreadsPost(taskData, workspaceActiveBrand);
        } else {
          result = await generateThreadsInteraction(
            taskData,
            workspaceActiveBrand
          );
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  isLoading: false,
                  isError: false,
                  type: "threads_result", // Naya type set karo
                  content:
                    "I've generated a few options for your Threads post.", // Summary
                  resultData: result.data, // Poora 'data' array yahan store karo
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
                  content: "Sorry, an error occurred. Please try again.",
                  onRetry: () => performApiCall(messageId),
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      taskData,
      workspaceActiveBrand,
      threadsMode,
      dispatch,
      setMessages,
      setIsLoading,
    ]
  );

  const askQuestion = () => {
    if (!threadsMode) {
      const initialStep = copywriterWorkflows.THREADS[0].steps[0];
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
      const nextPhase = activeWorkflow.find(
        (p) => p.phase === currentPhaseIndex + 1
      );
      if (nextPhase) {
        dispatch(startNextPhase({}));
      } else {
        const loadingMessageId = uuidv4();
        setMessages((prev) => [
          ...prev,
          {
            id: loadingMessageId,
            role: "assistant",
            content: `Crafting your Threads ${threadsMode}...`,
            timestamp: new Date(),
            isLoading: true,
          },
        ]);
        performApiCall(loadingMessageId);
      }
    }
  };

  useEffect(() => {
    if (
      activeSubTask === "THREADS" &&
      Object.keys(taskData).length === 0 &&
      !hasStartedRef.current
    ) {
      askQuestion();
      hasStartedRef.current = true;
    }
  }, [activeSubTask, taskData]);

  useEffect(() => {
    if (
      threadsMode &&
      hasStartedRef.current &&
      currentStepIndex === 0 &&
      currentPhaseIndex === 0
    ) {
      askQuestion();
    }
  }, [threadsMode]);

  useEffect(() => {
    if (activeSubTask !== "THREADS") return;
    if (hasStartedRef.current && threadsMode && currentStepIndex > 0) {
      askQuestion();
    }
  }, [currentStepIndex, activeSubTask, threadsMode]);

  useEffect(() => {
    if (activeSubTask !== "THREADS") return;
    if (
      phaseStatus === "in-progress" &&
      currentStepIndex === 0 &&
      currentPhaseIndex > 0
    ) {
      askQuestion();
    }
  }, [currentPhaseIndex, phaseStatus, activeSubTask]);

  useEffect(() => {
    if (activeSubTask !== "THREADS") {
      hasStartedRef.current = false;
      setThreadsMode(null);
    }
  }, [activeSubTask]);

  const processStep = (value: string | null) => {
    if (!threadsMode) {
      if (value === "Generate a new Post") setThreadsMode("generate");
      else if (value === "Interact with a Post") setThreadsMode("interact");
      return;
    }

    const key = activeWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.key;
    if (key) {
      dispatch(submitStep({ key, value }));
      if (key === "media_intent.type" && value === "None") {
        dispatch(jumpToPhase({ phaseIndex: 3 }));
      }
    }
  };

  const isInputDisabled = threadsMode
    ? activeWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.type ===
      "select"
    : false;
  const isCurrentQuestionOptional = threadsMode
    ? !!activeWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.isOptional
    : false;

  return { processStep, isInputDisabled, isCurrentQuestionOptional };
};
