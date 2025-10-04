import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface LoadingStep {
  text: string;
  duration?: number; // Optional: expected duration in ms
}

interface CalendarMultiStepLoaderProps {
  loadingStates: LoadingStep[];
  currentStep: number;
  progress: number; // 0-100
  loading: boolean;
  duration?: number;
  loop?: boolean;
}

export default function CalendarMultiStepLoader({
  loadingStates,
  currentStep,
  progress,
  loading,
  duration = 2000,
  loop = false,
}: CalendarMultiStepLoaderProps) {
  const [displayedSteps, setDisplayedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (currentStep >= 0) {
      setDisplayedSteps((prev) => new Set([...prev, currentStep]));
    }
  }, [currentStep]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden"
          >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-700/50">
              <motion.div
                className="h-full bg-gradient-to-r from-[#E6A550] to-[#BC853B]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            <div className="p-8 pt-10">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-[#E6A550] to-[#BC853B]"
                >
                  <Loader2 className="w-8 h-8 text-black animate-spin" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Creating Your Content Calendar
                </h3>
                <p className="text-neutral-400">
                  This may take 7-8 minutes. Please don't close this window.
                </p>
              </div>

              {/* Loading steps */}
              <div className="space-y-4 mb-6">
                {loadingStates.map((state, index) => {
                  const isCompleted = index < currentStep;
                  const isActive = index === currentStep;
                  const shouldDisplay = displayedSteps.has(index);

                  return (
                    <AnimatePresence key={index} mode="wait">
                      {shouldDisplay && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          {/* Status icon */}
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center justify-center"
                              >
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                              </motion.div>
                            ) : isActive ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="flex items-center justify-center"
                              >
                                <Loader2 className="w-6 h-6 text-[#E6A550]" />
                              </motion.div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-neutral-600" />
                            )}
                          </div>

                          {/* Step text */}
                          <div
                            className={`text-sm font-medium transition-colors ${
                              isCompleted
                                ? "text-green-500"
                                : isActive
                                ? "text-white"
                                : "text-neutral-500"
                            }`}
                          >
                            {state.text}
                          </div>

                          {/* Loading animation for active step */}
                          {/* {isActive && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: state.duration
                                  ? state.duration / 1000
                                  : duration / 1000,
                                ease: "linear",
                              }}
                              className="flex-1 h-1 bg-gradient-to-r from-[#E6A550] to-[#BC853B] rounded-full ml-2"
                            />
                          )} */}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })}
              </div>

              {/* Progress percentage */}
              <div className="text-center">
                <motion.div
                  key={progress}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent"
                >
                  {Math.round(progress)}%
                </motion.div>
                <p className="text-sm text-neutral-500 mt-2">
                  {currentStep + 1} of {loadingStates.length} steps completed
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}