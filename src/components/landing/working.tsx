"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Send, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Hook for automatic step progression when component comes into viewport
function useAutoStepProgression() {
  const [activeStep, setActiveStep] = useState(0);
  const [isInViewport, setIsInViewport] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Step durations in milliseconds
  const stepDurations = [3000, 2500, 2500, 2500, 2500, 2500, 2500, 4000]; // Last step stays longer

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        threshold: 0.3, // Trigger when 30% of component is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInViewport && !hasStarted) {
      setHasStarted(true);
      startStepProgression(0);
    }
  }, [isInViewport, hasStarted]);

  const clearExistingTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startStepProgression = (startIndex: number) => {
    clearExistingTimer();
    const safeIndex = Math.max(
      0,
      Math.min(startIndex, stepDurations.length - 1)
    );
    setActiveStep(safeIndex);

    const progressToNextStep = (currentStep: number) => {
      if (currentStep < stepDurations.length - 1) {
        timeoutRef.current = setTimeout(() => {
          setActiveStep(currentStep + 1);
          progressToNextStep(currentStep + 1);
        }, stepDurations[currentStep]);
      }
    };

    progressToNextStep(safeIndex);
  };

  // Public API: jump to a specific step and continue animation from there
  const jumpToStep = (index: number) => {
    setHasStarted(true);
    startStepProgression(index);
  };

  // Reset function for when component goes out of view
  useEffect(() => {
    if (!isInViewport && hasStarted) {
      // Optional: Reset when out of viewport
      // setActiveStep(0);
      // setHasStarted(false);
      // if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [isInViewport, hasStarted]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { activeStep, containerRef, isInViewport, jumpToStep };
}

export default function HowSuperCassprWorks() {
  const { activeStep, containerRef, jumpToStep } = useAutoStepProgression();
  const currentStep = activeStep;

  const steps = [
    {
      title: "Input Strategic Brief",
    },
    {
      title: "Connect Casspr Intelligent Agents",
    },
    {
      title: "Conduct In-Depth Brand Analysis",
    },
    {
      title: "Develop Comprehensive Content Calendar",
    },
    {
      title: "Generate High-Quality Content",
    },
    {
      title: "Autonomously Manage Social Media Presence",
    },
    {
      title: "Automate Post Scheduling and Distribution",
    },
    {
      title: "Executed",
      description: (
        <>
          Task completed successfully — all requested content has been
          <br /> generated and is now ready for review, use or distribution.
        </>
      ),
    },
  ];

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#020201] text-white py-12 px-4 sm:px-8 md:px-12"
      id="working"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-light">
            How{" "}
            <span className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
              Super Casspr
            </span>{" "}
            Works
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-start">
          {/* Left Side - Steps */}
          <div className="relative ">
            <div className="absolute left-[5.5px] top-2 bottom-0 w-px bg-gray-800" />
            <div className="space-y-1">
              {steps.map((step, index) => (
                <div
                  key={index}
                  onClick={() => jumpToStep(index)}
                  className={`relative pl-8 py-2 transition-all duration-500 cursor-pointer select-none ${
                    getStepStatus(index) === "active"
                      ? "opacity-100"
                      : getStepStatus(index) === "completed"
                      ? "opacity-70"
                      : "opacity-40"
                  }`}
                >
                  <div className="absolute -left-0 top-2">
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                        getStepStatus(index) === "completed"
                          ? "bg-[#e6c48a] border-[#e6c48a]"
                          : getStepStatus(index) === "active"
                          ? "bg-[#e6c48a] border-[#e6c48a] scale-125 shadow-[0_0_15px_rgba(230,196,138,0.7)]"
                          : "bg-black border-gray-600"
                      }`}
                    />
                  </div>

                  <div>
                    <h3
                      className={`text-md font-medium mb-2 transition-colors duration-500 ${
                        getStepStatus(index) === "active"
                          ? "text-white"
                          : getStepStatus(index) === "completed"
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <div>
                    <h3
                      className={`text-xs font-medium mb-2 transition-colors duration-500 ${
                        getStepStatus(index) === "active"
                          ? "text-white"
                          : getStepStatus(index) === "completed"
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {step.description}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Video/Interface Mockup */}
          <div className="lg:sticky lg:top-20 w-50% max-w-[640px]">
            <div className="bg-[#121417] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl shadow-black/30">
              {/* Mock Interface Header */}
              <div className="bg-gray-900/30 px-6 py-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">CASSPR AI</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="p-8 min-h-[390px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {/* Step 0 Content */}
                    {currentStep === 0 && (
                      <div className="space-y-4">
                        <div className="text-gray-300 mb-4">
                          Strategic Brief Input
                        </div>
                        <div className="bg-black/20 rounded-lg p-4 border border-gray-700">
                          <div className="flex items-center gap-3 mb-3">
                            <User className="h-5 w-5 text-[#e6c48a]" />
                            <span className="text-sm text-gray-400">You</span>
                          </div>
                          <motion.p
                            className="text-sm text-gray-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                          >
                            I need to create a comprehensive social media
                            strategy for our new product launch...
                          </motion.p>
                        </div>
                        <motion.div
                          className="flex items-center gap-3 bg-black/20 rounded-lg p-4 border border-gray-700"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                        >
                          <Mic className="h-5 w-5 text-[#e6c48a]" />
                          <span className="text-sm text-gray-400 flex-1">
                            Let's start...
                          </span>
                          <Send className="h-5 w-5 text-gray-500" />
                        </motion.div>
                      </div>
                    )}

                    {/* Steps 1-6 Content */}
                    {currentStep >= 1 && currentStep <= 6 && (
                      <div className="space-y-4 text-center">
                        <div className="text-gray-300 mb-4">
                          {steps[currentStep].title}
                        </div>
                        <div className="bg-black/20 rounded-lg p-6 border border-gray-700">
                          <Bot className="h-12 w-12 text-[#e6c48a] mx-auto mb-4 animate-pulse" />
                          <p className="text-sm text-gray-400">
                            Processing step {currentStep + 1} of {steps.length}
                            ...
                          </p>

                          {/* Progress bar */}
                          <div className="mt-4 bg-gray-800 rounded-full h-2">
                            <motion.div
                              className="bg-[#e6c48a] h-2 rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: currentStep === 1 ? 2.5 : 2.5,
                                ease: "easeInOut",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Final Step Content */}
                    {currentStep === 7 && (
                      <div className="space-y-4 text-center">
                        <div className="text-gray-300 mb-4">Task Completed</div>
                        <motion.div
                          className="bg-green-900/20 rounded-lg p-6 border border-green-500/30"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                          <motion.div
                            className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.3,
                              duration: 0.5,
                              type: "spring",
                              stiffness: 200,
                            }}
                          >
                            <svg
                              className="w-6 h-6 text-green-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                              />
                            </svg>
                          </motion.div>
                          <p className="text-sm text-green-400 font-medium">
                            All content ready for review and distribution
                          </p>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
