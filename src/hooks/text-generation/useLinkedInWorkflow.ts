import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  resetWorkflow,
  selectActiveWorkflow,
  startNextPhase,
  submitStep,
} from "@/store/feature/workflowSlice";
import { v4 as uuidv4 } from "uuid";
import {
  generateLinkedInComment,
  generateLinkedInPost,
} from "@/lib/workspace/text-generation/linkedinApiLogic";
import { Brand } from "@/store/feature/brandSlice";
import { Message } from "@/types/common";
import {
  copywriterWorkflows,
  linkedinPostWorkflow,
  linkedinInteractWorkflow,
} from "@/lib/workspace/text-generation/copywriterFlows";

interface UseLinkedInWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceActiveBrand: Brand | undefined;
}

export const useLinkedInWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
  workspaceActiveBrand,
}: UseLinkedInWorkflowProps) => {
  const dispatch = useAppDispatch();
  const {
    activeSubTask,
    currentPhaseIndex,
    currentStepIndex,
    taskData,
    phaseStatus,
  } = useAppSelector(selectActiveWorkflow);

  // Yeh state yaad rakhegi ki user 'post' mode mein hai ya 'interact' mode mein
  const [linkedInMode, setLinkedInMode] = useState<"post" | "interact" | null>(
    null
  );
  const hasStartedRef = useRef(false);

  // User ke selection ke hisaab se sahi workflow chuno
  const activeWorkflow =
    linkedInMode === "post" ? linkedinPostWorkflow : linkedinInteractWorkflow;

  // API call ka function (ab yeh mode ke hisaab se sahi API call karega)
  const performApiCall = useCallback(
    async (messageId: string) => {
      if (!workspaceActiveBrand) return;
      setIsLoading(true);

      try {
        let result;
        if (linkedInMode === "post") {
          result = await generateLinkedInPost(taskData, workspaceActiveBrand);
        } else {
          result = await generateLinkedInComment(
            taskData,
            workspaceActiveBrand
          );
        }

        const postContent =
          result.data?.[0]?.full_text || "API returned no content.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  isLoading: false,
                  isError: false,
                  type: "linkedin_result", // Naya type set karo
                  content:
                    "I've generated a few variations for your LinkedIn post.", // Summary text
                  resultData: result.data, // Poora 'data' array yahan store karo
                }
              : m
          )
        );
        // dispatch(startNextPhase({}));
        setTimeout(() => {
          dispatch(resetWorkflow());
        }, 500);
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
      linkedInMode,
      dispatch,
      setMessages,
      setIsLoading,
    ]
  );

  const askQuestion = () => {
    // Agar mode select nahi hua hai, to branching wala sawaal pucho
    if (!linkedInMode) {
      const initialStep = copywriterWorkflows.LINKEDIN[0].steps[0];
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

    // Mode select hone ke baad, active workflow se sawaal pucho
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
            content: `Perfect, crafting your LinkedIn ${linkedInMode}...`,
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
      activeSubTask === "LINKEDIN" &&
      Object.keys(taskData).length === 0 &&
      !hasStartedRef.current
    ) {
      askQuestion();
      hasStartedRef.current = true;
    }
  }, [activeSubTask, taskData]);

  // ✅ YEH HAI SAHI WALA 'RESPONDER' useEffect
  useEffect(() => {
    if (activeSubTask !== "LINKEDIN") return;
    if (hasStartedRef.current && linkedInMode && currentStepIndex > 0) {
      askQuestion();
    }
  }, [currentStepIndex, activeSubTask, linkedInMode]);

  // ✅ YEH HAI SAHI WALA 'PHASE CHANGER' useEffect
  useEffect(() => {
    if (activeSubTask !== "LINKEDIN") return;
    if (
      phaseStatus === "in-progress" &&
      currentStepIndex === 0 &&
      currentPhaseIndex > 0
    ) {
      askQuestion();
    }
  }, [currentPhaseIndex, phaseStatus, activeSubTask]);

  // ❌ Yahan se duplicate useEffects hata diye gaye hain

  // Reset logic (Yeh theek hai)
  useEffect(() => {
    if (activeSubTask !== "LINKEDIN") {
      hasStartedRef.current = false;
      setLinkedInMode(null);
    }
  }, [activeSubTask]);

  useEffect(() => {
    // Guard: Sirf tabhi chalao jab 'linkedInMode' null se 'post' ya 'interact' hua ho.
    if (linkedInMode && hasStartedRef.current) {
      // Ab naye mode ka pehla sawaal pucho
      askQuestion();
    }
  }, [linkedInMode]);

  // User ka jawab process karne wala main function (Yeh theek hai)
  const processStep = (value: string | null) => {
    if (!linkedInMode) {
      if (value === "Generate a new Post") {
        setLinkedInMode("post");
      } else if (value === "Comment on a Post") {
        setLinkedInMode("interact");
      }
      return;
    }
    const key = activeWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.key;
    if (key) {
      dispatch(submitStep({ key, value }));
    }
  };
  const isInputDisabled = linkedInMode
    ? activeWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.type ===
      "select"
    : false;
  const isCurrentQuestionOptional = linkedInMode
    ? !!activeWorkflow[currentPhaseIndex]?.steps[currentStepIndex]?.isOptional
    : false;

  return { processStep, isInputDisabled, isCurrentQuestionOptional };
};
