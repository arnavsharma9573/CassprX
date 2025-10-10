import React, { useState, useRef, useEffect } from "react";
import ChatInput from "../create-calendar/ChatInput";
import { AgentDock } from "./FloatingDock";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { BrandSwitcher } from "./BrandSwitcher";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { selectCurrentAgent } from "@/store/feature/agentSlice";
import { RootState } from "@/store/store";
import {
  resetWorkflow,
  selectActiveWorkflow,
  startWorkflow,
} from "@/store/feature/workflowSlice";
import { SubTaskDock } from "./SubTaskDock";
import { useCarouselWorkflow } from "@/hooks/useCarouselWorkflow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMascotWorkflow } from "@/hooks/useMascotWorkflow";
import { useMemeWorkflow } from "@/hooks/useMemeWorkflow";
import { FileInputButton } from "./FileInputButton";
import { usePresetWorkflow } from "@/hooks/usePresetWorkflow";
import { usePrintAdWorkflow } from "@/hooks/usePrintAdWorkflow";
import Image from "next/image";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  options?: string[];
  type?: "select" | "text" | "textarea" | "file";
  imageUrls?: string[];
}

export default function ChatInterfaceAgents() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const selectedAgent = useAppSelector(selectCurrentAgent);
  const { brands, activeBrandId: globalActiveBrandId } = useAppSelector(
    (state: RootState) => state.brand
  );
  const { activeSubTask, currentPhaseIndex, currentStepIndex } =
    useAppSelector(selectActiveWorkflow);
  const [workspaceActiveBrandId, setWorkspaceActiveBrandId] =
    useState(globalActiveBrandId);

  useEffect(() => {
    setWorkspaceActiveBrandId(globalActiveBrandId);
  }, [globalActiveBrandId]);

  const workspaceActiveBrand = brands.find(
    (b) => b.id === workspaceActiveBrandId
  );

  const {
    handleCarouselSubmit,
    handleCarouselOptionSelect,
    isCarouselInputDisabled,
    isCurrentQuestionOptional: isCarouselQuestionOptional,
    handleSkip: handleCarouselSkip,
  } = useCarouselWorkflow({
    messages,
    setMessages,
    setIsLoading,
    workspaceActiveBrand,
  });

  const {
    handleMascotSubmit,
    handleMascotOptionSelect,
    handleMascotFileSubmit,
    isMascotInputDisabled,
    isCurrentQuestionOptional: isMascotQuestionOptional,
    handleSkip: handleMascotSkip,
  } = useMascotWorkflow({
    messages,
    setMessages,
    setIsLoading,
  });

  const {
    handleMemeSubmit,
    handleMemeOptionSelect,
    isMemeInputDisabled,
    isCurrentQuestionOptional: isMemeQuestionOptional,
    handleSkip: handleMemeSkip,
    handleMemeFileSubmit,
  } = useMemeWorkflow({
    setMessages,
    setIsLoading,
  });

  const {
    handleSubmit: handlePresetSubmit,
    handleOptionSelect: handlePresetOptionSelect,
    handleFileSubmit: handlePresetFileSubmit,
    isInputDisabled: isPresetInputDisabled,
  } = usePresetWorkflow({ messages, setMessages, setIsLoading });

  const {
    handleSubmit: handlePrintAdSubmit,
    handleFileSubmit: handlePrintAdFileSubmit,
    handleSkip: handlePrintAdSkip,
    isInputDisabled: isPrintAdInputDisabled,
    isCurrentQuestionOptional: isPrintAdQuestionOptional,
  } = usePrintAdWorkflow({ messages, setMessages, setIsLoading });

  const isCurrentQuestionOptional =
    (activeSubTask === "MEME" && isMemeQuestionOptional) ||
    (activeSubTask === "CAROUSEL" && isCarouselQuestionOptional) ||
    (activeSubTask === "MASCOT" && isMascotQuestionOptional) ||
    (activeSubTask === "PRINT_AD" && isPrintAdQuestionOptional);

  const handleSkip = () => {
    if (activeSubTask === "CAROUSEL") {
      handleCarouselSkip();
    } else if (activeSubTask === "MASCOT") {
      handleMascotSkip();
    } else if (activeSubTask === "MEME") {
      handleMemeSkip();
    } else if (activeSubTask === "PRINT_AD") {
      handlePrintAdSkip();
    }
  };

  useEffect(() => {
    if (selectedAgent) {
      dispatch(startWorkflow(selectedAgent.id));
      setMessages([]);
    } else {
      dispatch(resetWorkflow());
    }
  }, [selectedAgent, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (activeSubTask === "CAROUSEL") {
      handleCarouselSubmit(inputValue);
    } else if (activeSubTask === "MASCOT") {
      handleMascotSubmit(inputValue);
    } else if (activeSubTask === "MEME") {
      handleMemeSubmit(inputValue);
    } else if (activeSubTask === "PRESET") {
      handlePresetSubmit(inputValue);
    } else if (activeSubTask === "PRINT_AD") {
      handlePrintAdSubmit(inputValue);
    } else {
      console.log("Handling generic submission for:", activeSubTask);
    }
    setInputValue("");
  };

  const handleOptionSelect = (option: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: option,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (activeSubTask === "CAROUSEL") {
      handleCarouselOptionSelect(option);
    } else if (activeSubTask === "MASCOT") {
      handleMascotOptionSelect(option);
    } else if (activeSubTask === "MEME") {
      handleMemeOptionSelect(option);
    } else if (activeSubTask === "PRESET") {
      handlePresetOptionSelect(inputValue);
    } else {
      console.log("Handling generic option select for:", activeSubTask);
    }
  };

  const handleFileSelect = (file: File) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Uploaded file: ${file.name}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    if (activeSubTask === "MEME") {
      handleMemeFileSubmit(file);
    } else if (activeSubTask === "PRESET") {
      handlePresetFileSubmit(file);
    } else if (activeSubTask === "PRINT_AD") {
      handlePrintAdFileSubmit(file);
    } else if (activeSubTask === "MASCOT") {
      handleMascotFileSubmit(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const hasMessages = messages.length > 0;

  const messageContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const messageItemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const optionsContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const optionItemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };
  const isInputDisabled =
    isLoading ||
    (activeSubTask === "CAROUSEL" && isCarouselInputDisabled) ||
    (activeSubTask === "MASCOT" && isMascotInputDisabled) ||
    (activeSubTask === "MEME" && isMemeInputDisabled) ||
    (activeSubTask === "PRESET" && isPresetInputDisabled) ||
    (activeSubTask === "PRINT_AD" && isPrintAdInputDisabled);

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <div className="flex flex-row flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col relative">
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!hasMessages ? (
                <motion.div
                  key="initial-bg"
                  className="w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src="/WorkspaceBg.webp"
                    alt="Workspace Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="messages-area"
                  className="h-full overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="max-w-4xl mx-auto px-6 py-8">
                    <motion.div
                      className="space-y-6"
                      variants={messageContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <AnimatePresence>
                        {messages.map((message, index) => {
                          let isAnswered = false;
                          if (message.id.startsWith("q-")) {
                            const [_, msgPhase, msgStep] = message.id
                              .split("-")
                              .map(Number);
                            if (
                              currentPhaseIndex > msgPhase ||
                              (currentPhaseIndex === msgPhase &&
                                currentStepIndex > msgStep)
                            ) {
                              isAnswered = true;
                            }
                          }

                          return (
                            <motion.div
                              key={`${message.id}-${index}`}
                              variants={messageItemVariants}
                              className={`flex gap-4 ${
                                message.role === "user"
                                  ? "flex-row-reverse"
                                  : "flex-row"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  message.role === "user"
                                    ? "bg-white/10 border border-white/20"
                                    : ""
                                }`}
                              >
                                {message.role === "user" ? (
                                  <Avatar className="size-7">
                                    <AvatarImage
                                      src={user?.avatar_url}
                                      alt={user?.name.charAt(0)}
                                    />
                                    <AvatarFallback className="bg-neutral-800 text-white font-bold">
                                      {user?.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <Avatar className="size-7">
                                    <AvatarImage
                                      src="/Logo4.png"
                                      alt="Bot Avatar"
                                    />
                                    <AvatarFallback className="bg-neutral-800 text-white font-bold">
                                      BOT
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>

                              <div
                                className={`relative max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                                  message.role === "user"
                                    ? "bg-white/10 text-white"
                                    : "bg-neutral-900 text-neutral-200"
                                }`}
                              >
                                <div className="relative z-10">
                                  {message.content && (
                                    <p className="mb-2">{message.content}</p>
                                  )}

                                  {message.imageUrls && (
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                      {message.imageUrls.map((url, index) => (
                                        <a
                                          key={index}
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <Image
                                            src={url}
                                            alt={`Generated carousel image ${
                                              index + 1
                                            }`}
                                            width={512}
                                            height={512}
                                            className="rounded-lg object-cover aspect-square hover:opacity-80 transition-opacity"
                                          />
                                        </a>
                                      ))}
                                    </div>
                                  )}

                                  {/* Block for SELECT options */}
                                  {message.role === "assistant" &&
                                    message.type === "select" &&
                                    message.options && (
                                      <motion.div
                                        className="mt-4 space-y-2"
                                        variants={optionsContainerVariants}
                                        initial="hidden"
                                        animate="visible"
                                      >
                                        {message.options.map((option) => (
                                          <motion.label
                                            key={option}
                                            variants={optionItemVariants}
                                            className={`flex items-center w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 transition-colors ${
                                              isAnswered
                                                ? "opacity-60 cursor-not-allowed"
                                                : "hover:bg-neutral-700 cursor-pointer hover:border-neutral-600"
                                            }`}
                                          >
                                            <input
                                              type="radio"
                                              name={`option-${message.id}`}
                                              className="w-4 h-4 text-white bg-neutral-700 border-neutral-600 focus:ring-white focus:ring-2 disabled:opacity-50"
                                              onChange={() =>
                                                handleOptionSelect(option)
                                              }
                                              disabled={isAnswered}
                                            />
                                            <span className="ml-3 text-white">
                                              {option}
                                            </span>
                                          </motion.label>
                                        ))}
                                      </motion.div>
                                    )}

                                  {/* Block for FILE input - MOVED TO THE CORRECT LEVEL */}
                                  {message.role === "assistant" &&
                                    message.type === "file" && (
                                      <div className="mt-4">
                                        <FileInputButton
                                          onFileSelect={handleFileSelect}
                                          disabled={isAnswered}
                                        />
                                      </div>
                                    )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                      {isLoading && (
                        <motion.div className="flex gap-4"></motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.div className="flex-shrink-0 relative z-10 mb-4" layout>
            <div className="max-w-3xl mx-auto px-6 py-6">
              <div className="flex items-center gap-3">
                {/* Input takes most of the width */}
                <div className="flex-1">
                  <ChatInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    disabled={isInputDisabled}
                  />
                </div>

                {/* Skip button beside input */}
                {isCurrentQuestionOptional && !isInputDisabled && (
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 hover:text-white transition-all duration-200 whitespace-nowrap"
                  >
                    Skip
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-center items-center gap-4">
              <BrandSwitcher
                brands={brands.map((b) => ({ ...b, isDefault: !!b.isDefault }))}
                activeBrandId={workspaceActiveBrandId}
                onBrandSelect={setWorkspaceActiveBrandId}
              />
              <AgentDock />
            </div>
          </motion.div>
        </main>
        <div className="fixed right-6 top-[2%]">
          <AnimatePresence>
            {selectedAgent?.id === "content-creator" && (
              <motion.div
                key="subtask-dock"
                initial={{ x: 200, opacity: 0 }} // starts off-screen to the right
                animate={{ x: 0, opacity: 1 }} // slides in and fades in
                exit={{ x: 200, opacity: 0 }} // slides back out when hidden
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="shadow-lg rounded-xl"
              >
                <SubTaskDock />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
