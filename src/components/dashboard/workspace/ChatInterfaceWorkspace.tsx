import React, { useState, useRef, useEffect } from "react";
import { Bot, User, Loader2 } from "lucide-react";
import ChatInput from "../create-calendar/ChatInput";
import { AgentDock } from "./FloatingDock";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { BrandSwitcher } from "./BrandSwitcher";
import { useAppSelector } from "@/hooks/redux-hooks";
import { selectCurrentAgent } from "@/store/feature/agentSlice";
import { RootState } from "@/store/store";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatInterfaceAgents() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedAgent = useAppSelector(selectCurrentAgent);
  const { brands, activeBrandId: globalActiveBrandId } = useAppSelector(
    (state: RootState) => state.brand
  );

  // ✨ 2. Create LOCAL state for the workspace's brand selection
  const [workspaceActiveBrandId, setWorkspaceActiveBrandId] =
    useState(globalActiveBrandId);

  useEffect(() => {
    setWorkspaceActiveBrandId(globalActiveBrandId);
  }, [globalActiveBrandId]);

  // Find the full brand object using the LOCAL state
  const workspaceActiveBrand = brands.find(
    (b) => b.id === workspaceActiveBrandId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // 1. Prepare the payload with the correct context
    const apiPayload = {
      prompt: inputValue,
      agentId: selectedAgent?.id ?? "home",
      brandProfileId: workspaceActiveBrand?.isDefault
        ? "default"
        : workspaceActiveBrand?.profileId ?? null,
    };

    console.log("Sending to API:", apiPayload);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // 2. Simulate AI response using the selected agent and brand names
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        // ✨ This content is now dynamic based on your selections
        content: `Simulated response for agent: "${
          selectedAgent?.title ?? "Home"
        }" using brand context: "${workspaceActiveBrand?.name ?? "Default"}".`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Show AIR logo initially, black & white theme after first message
  const hasMessages = messages.length > 0;

  // Animation variants
  const backgroundVariants: Variants = {
    initial: { scale: 1, opacity: 1, y: 0 },
    exit: {
      scale: 1.2,
      opacity: 0,
      y: -100,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

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

  const inputAreaVariants: Variants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {!hasMessages ? (
          // Initial Screen with Background Image - No Scroll
          <motion.div
            key="initial-screen"
            initial="initial"
            exit="exit"
            className="flex flex-col h-full"
          >
            <motion.div
              className="flex-1 relative overflow-hidden"
              variants={backgroundVariants}
            >
              <img
                src="/WorkspaceBg.webp"
                alt="Workspace Background"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>

            {/* Input Area - Fixed at Bottom */}
            <motion.div
              className="flex-shrink-0 relative z-10 mb-4"
              variants={inputAreaVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="max-w-3xl mx-auto space-y-2 px-6 py-6">
                <ChatInput
                  value={inputValue}
                  onChange={handleInputChange}
                  onSubmit={handleSubmit}
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-center items-center gap-4">
                <BrandSwitcher
                  brands={brands.map((b) => ({
                    ...b,
                    isDefault: !!b.isDefault,
                  }))}
                  activeBrandId={workspaceActiveBrandId}
                  onBrandSelect={setWorkspaceActiveBrandId}
                />
                <AgentDock />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Chat Interface After First Message
          <motion.div
            key="chat-interface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
          >
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 py-8">
                <motion.div
                  className="space-y-6"
                  variants={messageContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        variants={messageItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={`flex gap-4 ${
                          message.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        <motion.div
                          className="flex-shrink-0"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              message.role === "user"
                                ? "bg-neutral-800"
                                : "bg-white"
                            }`}
                          >
                            {message.role === "user" ? (
                              <User className="w-5 h-5 text-white" />
                            ) : (
                              <Bot className="w-5 h-5 text-black" />
                            )}
                          </div>
                        </motion.div>

                        {/* Message Content */}
                        <div
                          className={`flex-1 max-w-2xl ${
                            message.role === "user" ? "text-right" : "text-left"
                          }`}
                        >
                          <motion.div
                            className={`inline-block px-6 py-4 rounded-2xl ${
                              message.role === "user"
                                ? "bg-white text-black"
                                : "bg-neutral-900 border border-neutral-800 text-white"
                            }`}
                            whileHover={{
                              scale: 1.01,
                              transition: { duration: 0.2 },
                            }}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </motion.div>
                          <motion.p
                            className="text-xs text-neutral-500 mt-2 px-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </motion.p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Loading Indicator - FIXED */}
                  {isLoading && (
                    <motion.div
                      className="flex gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <Bot className="w-5 h-5 text-black" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="inline-block px-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                          {/* Only animate the Loader2 icon, not the entire container */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Loader2 className="w-5 h-5 text-white" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>
              </div>
            </div>

            {/* Input Area - Fixed at Bottom */}
            <motion.div
              className="flex-shrink-0 mb-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.4,
              }}
            >
              <div className="max-w-3xl mx-auto space-y-2 px-6 py-6">
                <ChatInput
                  value={inputValue}
                  onChange={handleInputChange}
                  onSubmit={handleSubmit}
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-center items-center gap-4">
                <BrandSwitcher
                  brands={brands.map((b) => ({
                    ...b,
                    isDefault: !!b.isDefault,
                  }))}
                  activeBrandId={workspaceActiveBrandId}
                  onBrandSelect={setWorkspaceActiveBrandId}
                />
                <AgentDock />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
