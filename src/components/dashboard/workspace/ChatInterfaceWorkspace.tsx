import React, { useState, useRef, useEffect } from "react";
import ChatInput from "../create-calendar/ChatInput";
import { AgentDock } from "./FloatingDock";
import { motion, AnimatePresence } from "framer-motion";
import { BrandSwitcher } from "./BrandSwitcher";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { selectCurrentAgent } from "@/store/feature/agentSlice";
import { RootState } from "@/store/store";
import {
  AgentSubTask,
  resetWorkflow,
  selectActiveWorkflow,
  startWorkflow,
} from "@/store/feature/workflowSlice";
import { SubTaskDock } from "./SubTaskDock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileInputButton } from "./FileInputButton";
import Image from "next/image";
import {
  messageContainerVariants,
  messageItemVariants,
  optionItemVariants,
  optionsContainerVariants,
  subTaskDockVariants,
} from "@/lib/animations/animations";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useImageGeneration } from "@/hooks/image-genration/useImageGeneration";
import { Message } from "@/types/common";
import { CopywriterSubTaskDock } from "./agents/CopywriterSubTaskDock";
import { useTextGeneration } from "@/hooks/text-generation/useTextGeneration";
import { BloggerResultCard } from "./agents/BloggerResultCard";
import { LinkedInResultCard } from "./agents/LinkedInResultCard";
import { MediumResultCard } from "./agents/MediumResultCard";
import { ThreadsResultCard } from "./agents/ThreadsResultCard";
import { XResultCard } from "./agents/XResultCard";

const isImageGenerationTask = (task: AgentSubTask): boolean => {
  const imageTasks: AgentSubTask[] = [
    "CAROUSEL",
    "MASCOT",
    "MEME",
    "UGC",
    "PRESET",
    "PRINT_AD",
  ];
  return task ? imageTasks.includes(task) : false;
};

const isTextGenerationTask = (task: AgentSubTask): boolean => {
  const textTasks: AgentSubTask[] = [
    "BLOGGER",
    "LINKEDIN",
    "MEDIUM",
    "THREADS",
    "X",
  ];
  return task ? textTasks.includes(task) : false;
};

export default function ChatInterfaceAgents() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubDock, setActiveSubDock] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const selectedAgent = useAppSelector(selectCurrentAgent);
  const { brands, activeBrandId: globalActiveBrandId } = useAppSelector(
    (state: RootState) => state.brand
  );
  const { activeSubTask } = useAppSelector(selectActiveWorkflow);
  const [workspaceActiveBrandId, setWorkspaceActiveBrandId] =
    useState(globalActiveBrandId);

  useEffect(() => {
    setWorkspaceActiveBrandId(globalActiveBrandId);
  }, [globalActiveBrandId]);

  const workspaceActiveBrand = brands.find(
    (b) => b.id === workspaceActiveBrandId
  );

  const isWorkflowActive = activeSubTask !== null;

  useEffect(() => {
    if (workspaceActiveBrand) {
      console.log("✅ Workspace Active Brand Data:", workspaceActiveBrand);
    }
  }, [workspaceActiveBrand]);

  const imageGen = useImageGeneration({
    messages,
    setMessages,
    setIsLoading,
    workspaceActiveBrand,
  });

  const textGen = useTextGeneration({
    messages,
    setMessages,
    setIsLoading,
    workspaceActiveBrand,
  });

  useEffect(() => {
    if (selectedAgent?.id === "content-creator") {
      setActiveSubDock("content-creator");
    } else if (selectedAgent?.id === "copywriter") {
      setActiveSubDock("copywriter");
    } else {
      setActiveSubDock(null);
    }
  }, [selectedAgent]);

  useEffect(() => {
    if (activeSubTask) {
      setActiveSubDock(null);
    }
  }, [activeSubTask]);
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

    if (isImageGenerationTask(activeSubTask)) {
      imageGen.handleSubmit(inputValue);
    } else if (isTextGenerationTask(activeSubTask)) {
      console.log("Text generation started for:", activeSubTask);
      textGen.handleSubmit(inputValue); // Placeholder
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

    if (isImageGenerationTask(activeSubTask)) {
      imageGen.handleOptionSelect(option);
    } else if (isTextGenerationTask(activeSubTask)) {
      textGen.handleOptionSelect(option);
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

    if (isImageGenerationTask(activeSubTask)) {
      imageGen.handleFileSelect(file);
    }
  };

  const handleSkip = () => {
    if (isImageGenerationTask(activeSubTask)) {
      imageGen.handleSkip();
    } else if (isTextGenerationTask(activeSubTask)) {
      textGen.handleSkip();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const hasMessages = messages.length > 0;

  const isInputDisabled =
    isLoading ||
    (isImageGenerationTask(activeSubTask) && imageGen.isInputDisabled) ||
    (isTextGenerationTask(activeSubTask) && textGen.isInputDisabled);

  const isCurrentQuestionOptional =
    (isImageGenerationTask(activeSubTask) &&
      imageGen.isCurrentQuestionOptional) ||
    (isTextGenerationTask(activeSubTask) && textGen.isCurrentQuestionOptional);

  const showSubDockButton =
    selectedAgent?.id === "content-creator" ||
    selectedAgent?.id === "copywriter";

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
                          if (message.role === "assistant" && message.options) {
                            const nextMessage = messages[index + 1];
                            if (nextMessage && nextMessage.role === "user") {
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
                                className={`relative rounded-2xl text-sm leading-relaxed ${
                                  message.role === "user"
                                    ? "bg-white text-black"
                                    : "bg-neutral-900 text-neutral-200 border border-neutral-800"
                                } ${
                                  message.type === "blogger_result" ||
                                  message.type === "linkedin_result" ||
                                  message.type === "medium_result" ||
                                  message.type === "threads_result" ||
                                  message.type === "x_result"
                                    ? "w-full max-w-2xl p-6"
                                    : "max-w-[70%] px-5 py-3"
                                }`}
                              >
                                <div className="relative z-10">
                                  {message.type === "blogger_result" ? (
                                    <BloggerResultCard message={message} />
                                  ) : message.type === "linkedin_result" ? (
                                    <LinkedInResultCard message={message} />
                                  ) : message.type === "medium_result" ? (
                                    <MediumResultCard message={message} />
                                  ) : message.type === "threads_result" ? (
                                    <ThreadsResultCard message={message} />
                                  ) : message.type === "x_result" ? (
                                    <XResultCard message={message} />
                                  ) : (
                                    <>
                                      {message.content && (
                                        <div className="whitespace-pre-wrap">
                                          {message.isLoading ? (
                                            <div className="flex items-center gap-2 text-neutral-400">
                                              <div className="w-4 h-4 border-2 border-t-transparent border-neutral-400 rounded-full animate-spin"></div>
                                              <span>{message.content}</span>
                                            </div>
                                          ) : message.isError ? (
                                            <div className="flex items-center gap-3">
                                              <p className="text-red-400">
                                                {message.content}
                                              </p>
                                              {message.onRetry && (
                                                <button
                                                  onClick={message.onRetry}
                                                  title="Retry"
                                                >
                                                  <RefreshCw className="w-4 h-4 text-neutral-400 hover:text-white transition-colors" />
                                                </button>
                                              )}
                                            </div>
                                          ) : (
                                            <p>{message.content}</p>
                                          )}
                                        </div>
                                      )}
                                      {message.imageUrls && (
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                          {message.imageUrls
                                            .filter(Boolean)
                                            .map((url, index) => (
                                              <a
                                                key={index}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <Image
                                                  src={url}
                                                  alt={`Generated image ${
                                                    index + 1
                                                  }`}
                                                  width={512}
                                                  height={512}
                                                  className="rounded-lg object-cover aspect-square hover:opacity-90 transition-opacity"
                                                />
                                              </a>
                                            ))}
                                        </div>
                                      )}
                                      {message.historyUrls && (
                                        <div className="mt-4 pt-3 border-t border-neutral-700">
                                          <p className="text-xs text-neutral-400 mb-2 font-medium">
                                            Edit History:
                                          </p>
                                          <div className="flex flex-wrap gap-2">
                                            {[...message.historyUrls]
                                              .reverse()
                                              .filter(Boolean)
                                              .map((url, index) => (
                                                <a
                                                  key={`hist-${index}`}
                                                  href={url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  title={`Version ${index + 1}`}
                                                >
                                                  <Image
                                                    src={url}
                                                    alt={`Edit history ${
                                                      index + 1
                                                    }`}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-md object-cover aspect-square opacity-60 hover:opacity-100 transition-opacity"
                                                  />
                                                </a>
                                              ))}
                                          </div>
                                        </div>
                                      )}
                                      {message.role === "assistant" &&
                                        message.type === "select" &&
                                        message.options && (
                                          <motion.div
                                            className="mt-4 space-y-2"
                                            variants={optionsContainerVariants}
                                            initial="hidden"
                                            animate="visible"
                                          >
                                            {message.options.map((option) => {
                                              // ✅ Step 1: Check karo ki yeh option "Coming Soon" hai ya nahi
                                              const isComingSoon =
                                                option ===
                                                  "Comment on a Post" ||
                                                option ===
                                                  "Interact with a Post";

                                              return (
                                                <motion.label
                                                  key={option}
                                                  variants={optionItemVariants}
                                                  className={`flex items-center w-full p-3 rounded-lg border border-neutral-700 transition-colors ${
                                                    // ✅ Step 2: Agar 'isAnswered' ya 'isComingSoon' hai, to disabled style lagao
                                                    isAnswered || isComingSoon
                                                      ? "bg-neutral-800 opacity-50 cursor-not-allowed"
                                                      : "bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
                                                  }`}
                                                >
                                                  <input
                                                    type="radio"
                                                    name={`option-${message.id}`}
                                                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
                                                    onChange={() => {
                                                      // ✅ Step 3: Sirf tabhi click handle karo jab option disabled na ho
                                                      if (!isComingSoon) {
                                                        handleOptionSelect(
                                                          option
                                                        );
                                                      }
                                                    }}
                                                    disabled={
                                                      isAnswered || isComingSoon
                                                    }
                                                  />
                                                  <span className="ml-3 text-white">
                                                    {option}
                                                  </span>

                                                  {/* ✅ Step 4: Agar 'isComingSoon' hai, to badge dikhao */}
                                                  {isComingSoon && (
                                                    <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 font-semibold px-2 py-0.5 rounded-full">
                                                      Coming Soon
                                                    </span>
                                                  )}
                                                </motion.label>
                                              );
                                            })}
                                          </motion.div>
                                        )}
                                      {message.role === "assistant" &&
                                        message.type === "file" && (
                                          <div className="mt-4">
                                            <FileInputButton
                                              onFileSelect={handleFileSelect}
                                              disabled={isAnswered}
                                            />
                                          </div>
                                        )}
                                    </>
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
          <motion.div className="flex-shrink-0 relative z-10" layout>
            <div className="max-w-3xl mx-auto px-6 relative">
              {showSubDockButton && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full flex justify-center items-end">
                  <AnimatePresence>
                    {activeSubDock === "content-creator" && (
                      <motion.div
                        key="content-creator-dock"
                        variants={subTaskDockVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mr-3"
                      >
                        <SubTaskDock />
                      </motion.div>
                    )}
                    {activeSubDock === "copywriter" && (
                      <motion.div
                        key="copywriter-dock"
                        variants={subTaskDockVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mr-3"
                      >
                        <CopywriterSubTaskDock />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.button
                    onClick={() =>
                      setActiveSubDock((prev) =>
                        prev ? null : selectedAgent?.id || null
                      )
                    }
                    className="absolute right-8 w-8 h-8 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    title={activeSubDock ? "Close Sub-tasks" : "Open Sub-tasks"}
                  >
                    {activeSubDock ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronUp size={16} />
                    )}
                  </motion.button>
                </div>
              )}
              <div className="pb-6 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <ChatInput
                      value={inputValue}
                      onChange={handleInputChange}
                      onSubmit={handleSubmit}
                      disabled={isInputDisabled}
                    />
                  </div>
                  {isCurrentQuestionOptional && (
                    <button
                      onClick={handleSkip}
                      className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 hover:text-white transition-all duration-200 whitespace-nowrap"
                    >
                      Skip
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-4 mb-4">
              <BrandSwitcher
                brands={brands.map((b) => ({ ...b, isDefault: !!b.isDefault }))}
                activeBrandId={workspaceActiveBrandId}
                onBrandSelect={setWorkspaceActiveBrandId}
                disabled={isWorkflowActive}
              />
              <AgentDock />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
