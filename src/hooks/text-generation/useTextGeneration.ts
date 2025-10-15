import { useAppSelector } from "@/hooks/redux-hooks";
import {
  AgentSubTask,
  selectActiveWorkflow,
} from "@/store/feature/workflowSlice";
import { Brand } from "@/store/feature/brandSlice";
import { Message } from "@/types/common";
import { useBloggerWorkflow } from "./useBloggerWorkflow";
import { useLinkedInWorkflow } from "./useLinkedInWorkflow";
import { useMediumWorkflow } from "./useMediumWorkflow";
import { useThreadsWorkflow } from "./useThreadsWorkflow";
import { useXWorkflow } from "./useXWorkflow";

interface UseTextGenerationProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceActiveBrand: Brand | undefined;
}

export const useTextGeneration = ({
  messages,
  setMessages,
  setIsLoading,
  workspaceActiveBrand,
}: UseTextGenerationProps) => {
  const { activeSubTask } = useAppSelector(selectActiveWorkflow);

  // ✅ Step 2: Dono workflow hooks ko yahan call karo
  const blogger = useBloggerWorkflow({
    messages,
    setMessages,
    setIsLoading,
    workspaceActiveBrand,
  });
  const linkedIn = useLinkedInWorkflow({
    messages,
    setMessages,
    setIsLoading,
    workspaceActiveBrand,
  });

  const medium = useMediumWorkflow({
    messages,
    setMessages,
    setIsLoading,
    workspaceActiveBrand,
  });

  const threads = useThreadsWorkflow({
    messages,
    setMessages,
    setIsLoading,
    workspaceActiveBrand,
  });

  const x = useXWorkflow({
    messages,
    setMessages,
    setIsLoading,
    workspaceActiveBrand,
  });

  const processUserInput = (value: string | null) => {
    switch (activeSubTask) {
      case "BLOGGER":
        return blogger.processStep(value);
      case "LINKEDIN":
        return linkedIn.processStep(value);
      case "MEDIUM":
        return medium.processStep(value);
      case "THREADS":
        return threads.processStep(value);
      case "X":
        return x.processStep(value);
    }
  };

  // Yeh handlers ab 'processUserInput' ko use karte hain (inko change nahi karna)
  const handleSubmit = (value: string) => processUserInput(value);
  const handleOptionSelect = (option: string) => processUserInput(option);
  const handleSkip = () => processUserInput(null);

  // ✅ Step 4: State variables ko update karo
  // Yeh activeSubTask ke hisaab se sahi hook se state lega
  const isInputDisabled = (() => {
    switch (activeSubTask) {
      case "BLOGGER":
        return blogger.isInputDisabled;
      case "LINKEDIN":
        return linkedIn.isInputDisabled;
      case "MEDIUM":
        return medium.isInputDisabled;
      case "THREADS":
        return threads.isInputDisabled;
      case "X":
        return x.isInputDisabled;
      default:
        return false;
    }
  })();

  const isCurrentQuestionOptional = (() => {
    switch (activeSubTask) {
      case "BLOGGER":
        return blogger.isCurrentQuestionOptional;
      case "LINKEDIN":
        return linkedIn.isCurrentQuestionOptional;
      case "MEDIUM":
        return medium.isCurrentQuestionOptional;
      case "THREADS":
        return threads.isCurrentQuestionOptional;
      case "X":
        return x.isCurrentQuestionOptional;
      default:
        return false;
    }
  })();

  return {
    handleSubmit,
    handleOptionSelect,
    handleSkip,
    isInputDisabled,
    isCurrentQuestionOptional,
  };
};
