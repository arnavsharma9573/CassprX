import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import {
  selectActiveWorkflow,
  selectWorkflowTaskData,
  submitStep,
  completePhase,
  jumpToPhase,
  resetWorkflow,
  revertStep,
} from "@/store/feature/workflowSlice";
import {
  startStyleAnalysisJob,
  startImageGenerationJob,
  createPlaygroundEditSession,
  startPlaygroundEditJob,
  pollPlaygroundJobStatus,
  getPlaygroundSessionHistory,
} from "@/lib/workspace/playgroundApiLogic";
import { contentCreatorFlows } from "@/lib/workspace/contentCreatorFlows";
import { streamMessage, urlToFile } from "@/lib/helper";
import { Message } from "@/types/common";

interface UgcWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useUgcWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
}: UgcWorkflowProps) => {
  const dispatch = useAppDispatch();
  const workflowData = useAppSelector(selectWorkflowTaskData);
  const { activeSubTask, currentPhaseIndex, currentStepIndex, phaseStatus } =
    useAppSelector(selectActiveWorkflow);

  const processedActionsRef = useRef(new Set());

  const currentFlow =
    activeSubTask === "UGC" ? contentCreatorFlows[activeSubTask] : null;
  const currentPhase = currentFlow
    ? currentFlow.phases[currentPhaseIndex]
    : null;
  const currentQuestion = currentPhase
    ? currentPhase.steps[currentStepIndex]
    : null;

  useEffect(() => {
    if (activeSubTask !== "UGC") {
      processedActionsRef.current.clear();
      return;
    }
  }, [activeSubTask]);

  useEffect(() => {
    if (activeSubTask !== "UGC") return;

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
      if (currentPhase?.name === "ANALYZE_INPUTS") {
        triggerStyleAnalysis();
      } else if (currentPhase?.name === "GENERATE_INPUTS") {
        triggerImageGeneration();
      } else if (currentPhase?.name === "EDITOR_SETUP") {
        beginEditingSession(workflowData.base_image);
      }
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

  const triggerStyleAnalysis = async () => {
    const messageId = "analyze-loading";
    setIsLoading(true);
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== messageId),
      {
        id: messageId,
        role: "assistant",
        content: "Analyzing image style...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);
    try {
      const summarize = workflowData.summarize_prompt === "Yes";
      const { jobId } = await startStyleAnalysisJob(
        workflowData.reference_image,
        workflowData.style_components,
        summarize
      );

      const pollInterval = setInterval(async () => {
        const job = await pollPlaygroundJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          setMessages((prev) => prev.filter((m) => m.id !== messageId));

          if (job.status === "completed" && job.result?.detailed_analysis) {
            const analysisText = `Analysis complete! Here are the style properties:\n\`\`\`json\n${JSON.stringify(
              job.result.detailed_analysis,
              null,
              2
            )}\n\`\`\``;
            streamMessage("analyze-result", analysisText, setMessages, () => {
              if (job.result.concise_prompt) {
                const promptText = `**Generated Prompt**\n\n---\n\n${job.result.concise_prompt}`;
                streamMessage("analyze-prompt", promptText, setMessages, () =>
                  dispatch(resetWorkflow())
                );
              } else {
                dispatch(resetWorkflow());
              }
            });
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: "analyze-error",
                role: "assistant",
                content: "❌ Style analysis failed. Tap to try again.",
                isError: true,
                onRetry: triggerStyleAnalysis,
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
                content: "❌ Could not start analysis. Tap to try again.",
                isLoading: false,
                isError: true,
                onRetry: triggerStyleAnalysis,
              }
            : msg
        )
      );
    }
  };

  const triggerImageGeneration = async () => {
    const messageId = "generate-loading";
    setIsLoading(true);
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== messageId),
      {
        id: messageId,
        role: "assistant",
        content: "Generating your image...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);
    try {
      const quality = workflowData.quality || "medium";
      const { jobId } = await startImageGenerationJob(
        workflowData.prompt,
        quality
      );

      const pollInterval = setInterval(async () => {
        const job = await pollPlaygroundJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          setMessages((prev) => prev.filter((m) => m.id !== messageId));

          if (job.status === "completed" && job.result?.image_url) {
            setMessages((prev) => [
              ...prev,
              {
                id: "ugc-generated",
                role: "assistant",
                content: "",
                imageUrls: [job.result.image_url],
                timestamp: new Date(),
              },
            ]);
            dispatch(
              jumpToPhase({
                phaseIndex: 3,
                newData: { generated_image_url: job.result.image_url },
              })
            );
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: "generate-error",
                role: "assistant",
                content: "❌ Image generation failed. Tap to try again.",
                isError: true,
                onRetry: triggerImageGeneration,
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
                content: "❌ Could not start generation. Tap to try again.",
                isLoading: false,
                isError: true,
                onRetry: triggerImageGeneration,
              }
            : msg
        )
      );
    }
  };

  const beginEditingSession = async (imageSource: File | string) => {
    const messageId = "editor-loading";
    setIsLoading(true);
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== messageId),
      {
        id: messageId,
        role: "assistant",
        content: "Initializing editing session...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);
    try {
      const imageFile =
        typeof imageSource === "string"
          ? await urlToFile(imageSource, "edit-base.png")
          : imageSource;
      const { sessionId } = await createPlaygroundEditSession(imageFile);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      dispatch(
        jumpToPhase({ phaseIndex: 5, newData: { session_id: sessionId } })
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                content:
                  "❌ Could not start editing session. Tap to try again.",
                isLoading: false,
                isError: true,
                onRetry: () => beginEditingSession(imageSource),
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const performEdit = async (prompt: string) => {
    const messageId = `edit-loading-${Date.now()}`;
    setIsLoading(true);
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== messageId),
      {
        id: messageId,
        role: "assistant",
        content: `Applying your edit: "${prompt}"...`,
        isLoading: true,
        timestamp: new Date(),
      },
    ]);

    try {
      const { jobId } = await startPlaygroundEditJob(
        workflowData.session_id,
        prompt
      );

      const pollInterval = setInterval(async () => {
        const job = await pollPlaygroundJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          setMessages((prev) => prev.filter((m) => m.id !== messageId));

          if (job.status === "completed" && job.result?.image_url) {
            const sessionState = await getPlaygroundSessionHistory(
              workflowData.session_id
            );
            setMessages((prev) => [
              ...prev,
              {
                id: `edit-${jobId}`,
                role: "assistant",
                content: "Here's the updated version!",
                imageUrls: [sessionState.currentImageUrl],
                historyUrls: sessionState.historyUrls,
                timestamp: new Date(),
              },
            ]);

            // ✅ FIX: Manually re-ask the editing question to continue the loop.
            const editingQuestion = contentCreatorFlows.UGC.phases.find(
              (p) => p.name === "EDITING_LOOP"
            )?.steps[0].question;
            if (editingQuestion) {
              streamMessage(`q-loop-${jobId}`, editingQuestion, setMessages);
            }
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: `err-edit-${jobId}`,
                role: "assistant",
                content:
                  "❌ Edit failed. Try a different prompt or tap to retry.",
                isError: true,
                onRetry: () => performEdit(prompt),
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
                content: "❌ Could not start the edit job. Tap to try again.",
                isLoading: false,
                isError: true,
                onRetry: () => performEdit(prompt),
              }
            : msg
        )
      );
    }
  };

  const handleUgcSubmit = (inputValue: string) => {
    if (currentPhase?.name === "EDITING_LOOP") {
      if (inputValue.toLowerCase().trim() === "done") {
        streamMessage(
          "done",
          "Great! Your editing session is complete.",
          setMessages,
          () => dispatch(resetWorkflow())
        );
      } else {
        performEdit(inputValue);
      }
    } else if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: inputValue }));
    }
  };

  const handleUgcOptionSelect = (option: string) => {
    if (currentPhase?.name === "MODE_SELECTION") {
      const newData = { ugc_mode: option };
      if (option === "Analyze an image's style") {
        dispatch(jumpToPhase({ phaseIndex: 1, newData }));
      } else if (option === "Generate a new image from text") {
        dispatch(jumpToPhase({ phaseIndex: 2, newData }));
      } else if (option === "Edit an existing image") {
        dispatch(jumpToPhase({ phaseIndex: 4, newData }));
      }
    } else if (currentPhase?.name === "EDIT_DECISION_UGC") {
      if (option === "Yes, start editing") {
        beginEditingSession(workflowData.generated_image_url);
      } else {
        dispatch(resetWorkflow());
      }
    } else if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: option }));
    }
  };

  const handleUgcFileSubmit = (file: File) => {
    if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: file }));
    }
  };

  const handleSkip = () => {
    if (currentQuestion && currentQuestion.required === false) {
      dispatch(submitStep({ key: currentQuestion.key, value: null }));
    }
  };

  const isInputDisabled =
    phaseStatus === "awaiting-api-call" ||
    currentQuestion?.type === "select" ||
    currentQuestion?.type === "file";
  const isCurrentQuestionOptional = currentQuestion?.required === false;

  return {
    handleUgcSubmit,
    handleUgcOptionSelect,
    handleUgcFileSubmit,
    handleSkip,
    isInputDisabled,
    isCurrentQuestionOptional,
  };
};
