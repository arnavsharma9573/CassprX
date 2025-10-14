import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux-hooks";
import {
  selectActiveWorkflow,
  selectWorkflowTaskData,
  completePhase,
  storeApiResult,
  startNextPhase,
  submitStep,
  resetWorkflow,
  revertStep,
  jumpToPhase,
} from "@/store/feature/workflowSlice";
import {
  generateMascotPrompts,
  startMascotGenerationJob,
  pollMascotJobStatus,
  createMascotEditSession,
  startMascotEditJob,
  MascotPromptInputs,
} from "@/lib/workspace/mascotApiLogic";
import { contentCreatorFlows } from "@/lib/workspace/contentCreatorFlows";
import { streamMessage, urlToFile } from "@/lib/helper";
import { Message } from "@/types/common";

interface MascotWorkflowProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMascotWorkflow = ({
  messages,
  setMessages,
  setIsLoading,
}: MascotWorkflowProps) => {
  const dispatch = useAppDispatch();
  const workflowData = useAppSelector(selectWorkflowTaskData);
  const { activeSubTask, currentPhaseIndex, currentStepIndex, phaseStatus } =
    useAppSelector(selectActiveWorkflow);

  const processedActionsRef = useRef(new Set());
  const currentFlow =
    activeSubTask === "MASCOT" ? contentCreatorFlows[activeSubTask] : null;
  const currentPhase = currentFlow
    ? currentFlow.phases[currentPhaseIndex]
    : null;
  const currentQuestion = currentPhase
    ? currentPhase.steps[currentStepIndex]
    : null;

  useEffect(() => {
    if (activeSubTask !== "MASCOT") {
      processedActionsRef.current.clear();
      return;
    }
  }, [activeSubTask]);

  useEffect(() => {
    if (activeSubTask !== "MASCOT") return;

    const actionId = `p${currentPhaseIndex}-s${currentStepIndex}-${phaseStatus}`;
    if (processedActionsRef.current.has(actionId)) return;

    if (phaseStatus === "in-progress" && currentQuestion) {
      streamMessage(
        `q-${currentPhaseIndex}-${currentStepIndex}`,
        currentQuestion.question,
        setMessages,
        () => {
          const finalOptions = Array.isArray(currentQuestion.options)
            ? currentQuestion.options
            : undefined;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === `q-${currentPhaseIndex}-${currentStepIndex}`
                ? { ...msg, options: finalOptions, type: currentQuestion.type }
                : msg
            )
          );
        }
      );
      processedActionsRef.current.add(actionId);
    } else if (
      phaseStatus === "in-progress" &&
      currentPhase &&
      !currentQuestion
    ) {
      dispatch(completePhase());
      processedActionsRef.current.add(actionId);
    } else if (phaseStatus === "awaiting-api-call") {
      if (currentPhase?.name === "MASCOT_PROMPTING") {
        triggerPromptGeneration();
      } else if (currentPhase?.name === "MASCOT_GENERATION") {
        triggerImageGeneration();
      } else if (currentPhase?.name === "DIRECT_EDIT_SETUP") {
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

  // 🧩 Prompt generation step
  const triggerPromptGeneration = () => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: "thinking-prompts",
        role: "assistant",
        content: "Generating some creative prompts for your mascot...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);

    const promptInputs: MascotPromptInputs = {
      brand_description: workflowData.brand_description,
      primary_audience: workflowData.primary_audience,
      desired_feeling: workflowData.desired_feeling,
      mascot_idea: workflowData.mascot_idea,
      visual_style: workflowData.visual_style,
      usage_context: workflowData.usage_context,
      color_preferences: workflowData.color_preferences,
    };

    generateMascotPrompts(promptInputs)
      .then((prompts) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === "thinking-prompts"
              ? {
                  ...msg,
                  isLoading: false,
                  content: "I came up with a few prompts. Choose one:",
                  options: prompts,
                  type: "select",
                }
              : msg
          )
        );
        dispatch(storeApiResult({ prompts }));
      })
      .catch(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === "thinking-prompts"
              ? {
                  ...msg,
                  isLoading: false,
                  isError: true,
                  content: "Sorry, I had trouble generating prompts.",
                  onRetry: triggerPromptGeneration,
                }
              : msg
          )
        );
      })
      .finally(() => setIsLoading(false));
  };

  // 🧩 Mascot generation step
  const triggerImageGeneration = () => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: "generating-mascot",
        role: "assistant",
        content:
          "Alright, bringing your mascot to life! This might take a moment...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);

    startMascotGenerationJob(workflowData.selected_prompt)
      .then(({ jobId }) => {
        const pollInterval = setInterval(async () => {
          const job = await pollMascotJobStatus(jobId);
          if (job.status === "completed" || job.status === "failed") {
            clearInterval(pollInterval);
            setIsLoading(false);
            if (job.status === "completed" && job.result?.image_url) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === "generating-mascot"
                    ? {
                        ...msg,
                        isLoading: false,
                        content: "Here’s your new mascot!",
                        imageUrls: [job.result.image_url],
                      }
                    : msg
                )
              );
              dispatch(
                startNextPhase({
                  newData: { generated_mascot_url: job.result.image_url },
                })
              );
            } else {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === "generating-mascot"
                    ? {
                        ...msg,
                        isLoading: false,
                        isError: true,
                        content: "Sorry, mascot generation failed.",
                        onRetry: triggerImageGeneration,
                      }
                    : msg
                )
              );
            }
          }
        }, 5000);
      })
      .catch(() => {
        setIsLoading(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === "generating-mascot"
              ? {
                  ...msg,
                  isLoading: false,
                  isError: true,
                  content: "Sorry, I couldn't start the generation job.",
                  onRetry: triggerImageGeneration,
                }
              : msg
          )
        );
      });
  };

  // 🧩 Handle user message submission
  const handleMascotSubmit = (inputValue: string) => {
    if (currentPhase?.name === "EDITING_LOOP") {
      if (inputValue.toLowerCase().trim() === "done") {
        streamMessage(
          "done",
          "Great! Your final mascot is ready.",
          setMessages,
          () => {
            dispatch(resetWorkflow());
          }
        );
      } else {
        performEdit(inputValue);
      }
    } else if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: inputValue }));
    }
  };

  const handleMascotOptionSelect = (option: string) => {
    if (currentPhase?.name === "MODE_SELECTION") {
      const newData = { mascot_mode: option };
      if (option === "Generate a new mascot from an idea") {
        dispatch(jumpToPhase({ phaseIndex: 1, newData }));
      } else if (option === "Directly edit an image I already have") {
        dispatch(jumpToPhase({ phaseIndex: 4, newData }));
      }
      return;
    }

    if (phaseStatus === "in-progress" && currentQuestion) {
      if (currentPhase?.name === "EDIT_DECISION") {
        if (option === "Start an editing session") {
          beginEditingSession(workflowData.generated_mascot_url);
        } else {
          dispatch(resetWorkflow());
        }
      } else {
        dispatch(submitStep({ key: currentQuestion.key, value: option }));
      }
    } else if (
      phaseStatus === "awaiting-api-call" &&
      currentPhase?.name === "MASCOT_PROMPTING"
    ) {
      dispatch(startNextPhase({ newData: { selected_prompt: option } }));
    }
  };

  const handleMascotFileSubmit = (file: File) => {
    if (currentPhase?.name === "DIRECT_EDIT_SETUP") {
      dispatch(submitStep({ key: "base_image", value: file }));
      dispatch(completePhase());
    } else if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: file }));
    }
  };

  const beginEditingSession = async (imageSource: File | string) => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: "starting-session",
        role: "assistant",
        content: "Initializing editing session...",
        isLoading: true,
        timestamp: new Date(),
      },
    ]);
    try {
      const mascotFile =
        typeof imageSource === "string"
          ? await urlToFile(imageSource, "mascot.png")
          : imageSource;
      const { sessionId } = await createMascotEditSession(mascotFile);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "starting-session"
            ? {
                ...msg,
                isLoading: false,
                content: "Editing session initialized successfully!",
              }
            : msg
        )
      );
      dispatch(
        jumpToPhase({ phaseIndex: 5, newData: { session_id: sessionId } })
      );
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "starting-session"
            ? {
                ...msg,
                isLoading: false,
                isError: true,
                content: "Sorry, I couldn't start an editing session.",
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
    const messageId = `editing-${Date.now()}`;
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        role: "assistant",
        content: `Applying your edit: "${prompt}"...`,
        isLoading: true,
        timestamp: new Date(),
      },
    ]);
    try {
      const { jobId } = await startMascotEditJob({
        session_id: workflowData.session_id,
        prompt,
      });

      const pollInterval = setInterval(async () => {
        const job = await pollMascotJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          setMessages((prev) => prev.filter((m) => m.id !== messageId));

          if (job.status === "completed" && job.result?.image_url) {
            // First, add the message containing the new image
            setMessages((prev) => [
              ...prev,
              {
                id: `edit-${jobId}`,
                role: "assistant",
                content: "Here's the updated version!",
                imageUrls: [job.result.image_url],
                timestamp: new Date(),
              },
            ]);

            // ✅ FIX: Manually re-ask the editing question to continue the loop.
            // This is more reliable than the previous state-change trick.
            const editingQuestion = contentCreatorFlows.MASCOT.phases.find(
              (p) => p.name === "EDITING_LOOP"
            )?.steps[0].question;
            if (editingQuestion) {
              await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay for better UX
              streamMessage(
                `q-loop-${jobId}`, // Use a unique ID for each loop iteration
                editingQuestion,
                setMessages
              );
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
                isLoading: false,
                isError: true,
                content: "❌ Could not start the edit job. Tap to try again.",
                onRetry: () => performEdit(prompt),
              }
            : msg
        )
      );
    }
  };

  const handleSkip = () => {
    if (currentQuestion && currentQuestion.required === false) {
      dispatch(submitStep({ key: currentQuestion.key, value: null }));
    }
  };

  const isCurrentQuestionOptional = currentQuestion?.required === false;
  const isMascotInputDisabled =
    phaseStatus === "awaiting-api-call" ||
    currentQuestion?.type === "select" ||
    currentQuestion?.type === "file";

  return {
    handleMascotSubmit,
    handleMascotOptionSelect,
    handleMascotFileSubmit,
    isMascotInputDisabled,
    handleSkip,
    isCurrentQuestionOptional,
  };
};
