import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  resetWorkflow,
  selectActiveWorkflow,
  startNextPhase,
  submitStep,
} from "@/store/feature/workflowSlice";
import { v4 as uuidv4 } from "uuid";
import { generateBloggerPost } from "@/lib/workspace/text-generation/bloggerApiLogic";
import { Brand } from "@/store/feature/brandSlice";
import { Message } from "@/types/common";
import { copywriterWorkflows } from "@/lib/workspace/text-generation/copywriterFlows";

interface UseBloggerWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceActiveBrand: Brand | undefined;
}

export const useBloggerWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
  workspaceActiveBrand,
}: UseBloggerWorkflowProps) => {
  const dispatch = useAppDispatch();
  const {
    activeSubTask,
    currentPhaseIndex,
    currentStepIndex,
    taskData,
    phaseStatus,
  } = useAppSelector(selectActiveWorkflow);

  const hasStartedRef = useRef(false);
  const bloggerWorkflow = copywriterWorkflows.BLOGGER;

  const performApiCall = useCallback(
    async (messageId: string) => {
      if (!workspaceActiveBrand) return;
      setIsLoading(true);

      try {
        const result = await generateBloggerPost(
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
                  type: "blogger_result",
                  content: `I've generated your blog post titled: "${result.data?.[0]?.title}"`,
                  resultData: result.data?.[0],
                }
              : m
          )
        );
        setTimeout(() => {
          dispatch(resetWorkflow());
        }, 500);

        // dispatch(startNextPhase({}));
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
    [taskData, workspaceActiveBrand, dispatch, setMessages, setIsLoading]
  );

  const askQuestion = () => {
    const phase = bloggerWorkflow.find((p) => p.phase === currentPhaseIndex);
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
      const nextPhase = bloggerWorkflow.find(
        (p) => p.phase === currentPhaseIndex + 1
      );
      if (nextPhase) {
        dispatch(startNextPhase({}));
      } else {
        // ✅ Yahi hai working logic: Seedha API call karo
        const loadingMessageId = uuidv4();
        setMessages((prev) => [
          ...prev,
          {
            id: loadingMessageId,
            role: "assistant",
            content: "Awesome, generating your blog post now...",
            timestamp: new Date(),
            isLoading: true,
          },
        ]);
        performApiCall(loadingMessageId);
      }
    }
  };

  // Conversation Starter
  useEffect(() => {
    if (
      activeSubTask === "BLOGGER" &&
      currentPhaseIndex === 0 &&
      currentStepIndex === 0 &&
      Object.keys(taskData).length === 0 &&
      !hasStartedRef.current
    ) {
      askQuestion();
      hasStartedRef.current = true;
    }
  }, [activeSubTask, currentPhaseIndex, currentStepIndex, taskData]);

  // Responder (jab user jawab de)
  useEffect(() => {
    if (activeSubTask !== "BLOGGER") return;
    if (hasStartedRef.current && currentStepIndex > 0) {
      askQuestion();
    }
  }, [currentStepIndex]);

  // Phase Changer
  useEffect(() => {
    if (activeSubTask !== "BLOGGER") return;
    if (
      phaseStatus === "in-progress" &&
      currentStepIndex === 0 &&
      currentPhaseIndex > 0
    ) {
      askQuestion();
    }
  }, [currentPhaseIndex, phaseStatus]);

  // Workflow Resetter
  useEffect(() => {
    if (activeSubTask !== "BLOGGER") {
      hasStartedRef.current = false;
    }
  }, [activeSubTask]);

  // Step Processor
  const processStep = (value: string | null) => {
    const key =
      bloggerWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.key;
    if (key) {
      dispatch(submitStep({ key, value }));
    }
  };

  const isInputDisabled =
    bloggerWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.type ===
    "select";
  const isCurrentQuestionOptional =
    !!bloggerWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.isOptional;

  return { processStep, isInputDisabled, isCurrentQuestionOptional };
};
