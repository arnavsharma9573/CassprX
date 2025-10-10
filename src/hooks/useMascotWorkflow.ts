import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./redux-hooks";
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
import { Message } from "@/components/dashboard/workspace/ChatInterfaceWorkspace";
import { streamMessage, urlToFile } from "@/lib/helper";


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
  const {
    activeSubTask,
    currentPhaseIndex,
    currentStepIndex,
    phaseStatus,
    apiResult,
  } = useAppSelector(selectActiveWorkflow);

  const processedActionsRef = useRef(new Set());

  const currentFlow = activeSubTask === "MASCOT" ? contentCreatorFlows[activeSubTask] : null;
  const currentPhase = currentFlow ? currentFlow.phases[currentPhaseIndex] : null;
  const currentQuestion = currentPhase ? currentPhase.steps[currentStepIndex] : null;

  useEffect(() => {
    if (activeSubTask !== "MASCOT") {
      processedActionsRef.current.clear();
      return;
    }
  }, [activeSubTask]);

  useEffect(() => {
    if (activeSubTask !== "MASCOT") return;

    const actionId = `p${currentPhaseIndex}-s${currentStepIndex}-${phaseStatus}`;
    if (processedActionsRef.current.has(actionId)) {
      return;
    }

    if (phaseStatus === "in-progress" && currentQuestion) {
      streamMessage(
        `q-${currentPhaseIndex}-${currentStepIndex}`,
        currentQuestion.question,
        setMessages,
        () => {
          const finalOptions: string[] | undefined = Array.isArray(
            currentQuestion.options
          ) ? currentQuestion.options : undefined;
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
    } else if (phaseStatus === "in-progress" && currentPhase && !currentQuestion) {
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

  const triggerPromptGeneration = () => {
    setIsLoading(true);
    streamMessage('thinking-prompts', 'Generating some creative prompts for your mascot...', setMessages, () => {
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
          dispatch(storeApiResult({ prompts }));
          streamMessage('prompt-select', 'I came up with a few prompts. Choose one:', setMessages, () => {
            setMessages((prev) => prev.map((msg) =>
              msg.id === 'prompt-select' ? { ...msg, options: prompts, type: 'select' } : msg
            ));
            setIsLoading(false);
          });
        })
        .catch((err) => {
          streamMessage('error-prompts', 'Sorry, I had trouble generating prompts.', setMessages);
          setIsLoading(false);
        });
    });
  };

  const triggerImageGeneration = () => {
    setIsLoading(true);
    streamMessage('generating-mascot', 'Alright, bringing your mascot to life! This might take a moment...', setMessages, () => {
      startMascotGenerationJob(workflowData.selected_prompt)
        .then(({ jobId }) => {
          const pollInterval = setInterval(async () => {
            const job = await pollMascotJobStatus(jobId);
            if (job.status === "completed" || job.status === "failed") {
              clearInterval(pollInterval);
              setIsLoading(false);
              if (job.status === "completed" && job.result?.image_url) {
                setMessages((prev) => [...prev, {
                  id: "mascot-complete", role: "assistant", content: "",
                  imageUrl: job.result.image_url, timestamp: new Date(),
                }]);
                dispatch(startNextPhase({ newData: { generated_mascot_url: job.result.image_url } }));
              } else {
                streamMessage('error-generation', 'Sorry, the mascot generation failed.', setMessages);
              }
            }
          }, 5000);
        })
        .catch((err) => {
          setIsLoading(false);
          streamMessage('error-job-start', "Sorry, I couldn't start the generation job.", setMessages);
        });
    });
  };

  const handleMascotSubmit = (inputValue: string) => {
    if (currentPhase?.name === "EDITING_LOOP") {
      if (inputValue.toLowerCase().trim() === "done") {
        streamMessage("done", "Great! Your final mascot is ready.", setMessages, () => {
          dispatch(resetWorkflow());
        });
      } else {
        performEdit(inputValue);
      }
    } else if (currentQuestion) {
      dispatch(submitStep({ key: currentQuestion.key, value: inputValue }));
    }
  };

  const handleMascotOptionSelect = (option: string) => {
    if (currentPhase?.name === 'MODE_SELECTION') {
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
    } else if (phaseStatus === "awaiting-api-call" && currentPhase?.name === "MASCOT_PROMPTING") {
      dispatch(startNextPhase({ newData: { selected_prompt: option } }));
    }
  };

  const handleMascotFileSubmit = (file: File) => {
    if (currentPhase?.name === 'DIRECT_EDIT_SETUP') {
        dispatch(submitStep({ key: 'base_image', value: file }));
        dispatch(completePhase());
    } else if (currentQuestion) {
        dispatch(submitStep({ key: currentQuestion.key, value: file }));
    }
  };

  const beginEditingSession = async (imageSource: File | string) => {
    setIsLoading(true);
    await new Promise<void>(resolve => streamMessage("starting-session", "Initializing editing session...", setMessages, resolve));
    try {
      let mascotFile: File;
      if (typeof imageSource === 'string') {
        mascotFile = await urlToFile(imageSource, 'mascot.png');
      } else {
        mascotFile = imageSource;
      }
      const { sessionId } = await createMascotEditSession(mascotFile);
      dispatch(jumpToPhase({ phaseIndex: 5, newData: { session_id: sessionId } }));
    } catch (error) {
       streamMessage("err-session", "Sorry, I couldn't start an editing session.", setMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const performEdit = async (prompt: string) => {
    setIsLoading(true);
    await new Promise<void>(resolve => streamMessage("editing", `Applying your edit: "${prompt}"...`, setMessages, resolve));
    try {
      const { jobId } = await startMascotEditJob({ session_id: workflowData.session_id, prompt });
      const pollInterval = setInterval(async () => {
        const job = await pollMascotJobStatus(jobId);
        if (job.status === "completed" || job.status === "failed") {
          clearInterval(pollInterval);
          setIsLoading(false);
          if (job.status === "completed" && job.result?.image_url) {
            streamMessage(`edit-${jobId}`, "Here's the updated version!", setMessages, () => {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === `edit-${jobId}` ? { ...msg, imageUrl: job.result.image_url } : msg
                )
              );
              dispatch(submitStep({ key: "last_edit", value: prompt }));
              dispatch(revertStep());
            });
          } else {
             streamMessage("err-edit", "Sorry, that edit didn't work. Try describing it differently.", setMessages);
          }
        }
      }, 5000);
    } catch (error) {
      setIsLoading(false);
      streamMessage("err-edit-start", "Sorry, I couldn't start the edit job.", setMessages);
    }
  };

  const handleSkip = () => {
    if (currentQuestion && currentQuestion.required === false) {
      dispatch(submitStep({ key: currentQuestion.key, value: null }));
    }
  };

  const isCurrentQuestionOptional = currentQuestion?.required === false;
  const isMascotInputDisabled = phaseStatus === "awaiting-api-call" || currentQuestion?.type === "select" || currentQuestion?.type === 'file';

  return {
    handleMascotSubmit,
    handleMascotOptionSelect,
    handleMascotFileSubmit,
    isMascotInputDisabled,
    handleSkip,
    isCurrentQuestionOptional,
  };
};