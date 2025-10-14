import { useAppSelector } from "@/hooks/redux-hooks";
import { selectActiveWorkflow } from "@/store/feature/workflowSlice";
import { Brand } from "@/store/feature/brandSlice";
import { useCarouselWorkflow } from "./useCarouselWorkflow";
import { useMascotWorkflow } from "./useMascotWorkflow";
import { useMemeWorkflow } from "./useMemeWorkflow";
import { usePresetWorkflow } from "./usePresetWorkflow";
import { usePrintAdWorkflow } from "./usePrintAdWorkflow";
import { useUgcWorkflow } from "./useUGCWorkflow";
import { Message } from "@/types/common";

// Props jo is master hook ko chahiye
interface UseImageGenerationProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceActiveBrand: Brand | undefined;
}

// Master Hook
export const useImageGeneration = ({
  messages,
  setMessages,
  setIsLoading,
  workspaceActiveBrand,
}: UseImageGenerationProps) => {
  const { activeSubTask } = useAppSelector(selectActiveWorkflow);

  // Saare individual hooks ko yahan call karo
  const carousel = useCarouselWorkflow({ messages, setMessages, setIsLoading, workspaceActiveBrand });
  const mascot = useMascotWorkflow({ messages, setMessages, setIsLoading });
  const meme = useMemeWorkflow({ messages, setMessages, setIsLoading });
  const preset = usePresetWorkflow({ messages, setMessages, setIsLoading });
  const printAd = usePrintAdWorkflow({ messages, setMessages, setIsLoading });
  const ugc = useUgcWorkflow({ messages, setMessages, setIsLoading });

  // Ek common handleSubmit function jo task ke hisaab se sahi function call karega
  const handleSubmit = (value: string) => {
    switch (activeSubTask) {
      case "CAROUSEL": return carousel.handleCarouselSubmit(value);
      case "MASCOT":   return mascot.handleMascotSubmit(value);
      case "MEME":     return meme.handleMemeSubmit(value);
      case "PRESET":   return preset.handleSubmit(value);
      case "PRINT_AD": return printAd.handleSubmit(value);
      case "UGC":      return ugc.handleUgcSubmit(value);
    }
  };

  // Ek common handleOptionSelect function
  const handleOptionSelect = (option: string) => {
    switch (activeSubTask) {
      case "CAROUSEL": return carousel.handleCarouselOptionSelect(option);
      case "MASCOT":   return mascot.handleMascotOptionSelect(option);
      case "MEME":     return meme.handleMemeOptionSelect(option);
      case "PRESET":   return preset.handleOptionSelect(option);
      case "UGC":      return ugc.handleUgcOptionSelect(option);
    }
  };

  // Ek common handleFileSelect function
  const handleFileSelect = (file: File) => {
    switch (activeSubTask) {
      case "MASCOT":   return mascot.handleMascotFileSubmit(file);
      case "MEME":     return meme.handleMemeFileSubmit(file);
      case "PRESET":   return preset.handleFileSubmit(file);
      case "PRINT_AD": return printAd.handleFileSubmit(file);
      case "UGC":      return ugc.handleUgcFileSubmit(file);
    }
  };
  
  // Ek common handleSkip function
  const handleSkip = () => {
    switch (activeSubTask) {
        case "CAROUSEL": return carousel.handleSkip();
        case "MASCOT":   return mascot.handleSkip();
        case "MEME":     return meme.handleSkip();
        case "PRINT_AD": return printAd.handleSkip();
        case "UGC":      return ugc.handleSkip();
      }
  }

  // Common state variables
  const isInputDisabled = [
    carousel.isCarouselInputDisabled,
    mascot.isMascotInputDisabled,
    meme.isMemeInputDisabled,
    preset.isInputDisabled,
    printAd.isInputDisabled,
    ugc.isInputDisabled,
  ].some(Boolean);

  const isCurrentQuestionOptional = [
    carousel.isCurrentQuestionOptional,
    mascot.isCurrentQuestionOptional,
    printAd.isCurrentQuestionOptional,
    meme.isCurrentQuestionOptional,
    ugc.isCurrentQuestionOptional,
  ].some(Boolean);

  // Sirf yeh common functions and state bahar bhejo
  return {
    handleSubmit,
    handleOptionSelect,
    handleFileSelect,
    handleSkip,
    isInputDisabled,
    isCurrentQuestionOptional,
  };
};