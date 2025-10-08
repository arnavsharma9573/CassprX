"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  BotIcon,
  UploadCloud,
  FileText,
  ImageIcon,
  CheckCircle2,
  Instagram,
  Facebook,
  Twitter,
  CalendarDays,
  Sparkles,
  Mail,
  Search,
  Users,
  Target,
  Loader2,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Link as LinkIcon, // Renamed to avoid conflict with Next.js Link
  Settings,
  GitMerge,
  Package, // For Brand Kit
  BrainCircuit, // For Deep Research
  CalendarPlus,
  Check,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// ========== TYPE DEFINITION ==========
type Message = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  component?: React.ReactNode;
};

type DemoStep = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: "pending" | "active" | "completed";
};

// ========== NEW STREAMING TEXT COMPONENT ==========
const StreamingTextMessage = ({
  text,
  onComplete,
  scroll,
}: {
  text: string;
  onComplete: () => void;
  scroll: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const isComplete = displayedText.length === text.length;

  useEffect(() => {
    if (isComplete) {
      onComplete();
      return;
    }

    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, displayedText.length + 1));
      scroll(); // Scroll the container as text is added
    }, 30); // Adjust typing speed here (lower is faster)

    return () => clearInterval(intervalId);
  }, [displayedText, isComplete, text, onComplete, scroll]);

  return (
    <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-white bg-gradient-to-b from-neutral-800/80 to-neutral-800/40 border border-neutral-700/50">
      {displayedText}
      {!isComplete && (
        <span
          className="inline-block w-[2px] h-4 bg-white ml-1 align-bottom animate-pulse"
          style={{ animationDuration: "1s" }}
        />
      )}
    </div>
  );
};

// ========== UI SIMULATION COMPONENTS (Unchanged) ==========

/** SCENE 2: Brand Profile & Kit Upload */
const BrandKitUpload = () => {
  const [uploads, setUploads] = useState([
    { name: "brand_guidelines.pdf", icon: FileText, status: "uploading" },
    { name: "logo.png", icon: ImageIcon, status: "uploading" },
    { name: "Website Link", icon: UploadCloud, status: "uploading" },
  ]);

  useEffect(() => {
    const timers = uploads.map((upload, index) =>
      setTimeout(() => {
        setUploads((prev) =>
          prev.map((u, i) => (i === index ? { ...u, status: "complete" } : u))
        );
      }, (index + 1) * 700)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-3 p-4 rounded-lg bg-neutral-900/60 border border-[#eac565]/20">
      {uploads.map((upload) => (
        <div key={upload.name} className="flex items-center gap-3 text-sm">
          <upload.icon className="w-4 h-4 text-neutral-400" />
          <span className="flex-grow text-white">{upload.name}</span>
          {upload.status === "uploading" ? (
            <div className="w-20 h-2 bg-neutral-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#eac565]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </div>
          ) : (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
        </div>
      ))}
    </div>
  );
};

/** SCENE 3: Social Media Integration */
const SocialMediaConnect = () => {
  const [connections, setConnections] = useState([
    {
      name: "Instagram",
      icon: (
        <Image src="/instagram.svg" alt="Instagram" width={24} height={24} />
      ),
      status: "connecting",
      color: "#E1306C",
    },
    {
      name: "Facebook",
      icon: <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />,
      status: "connecting",
      color: "#1877F2",
    },
    {
      name: "Twitter",
      icon: <Image src="/twitter.svg" alt="Twitter" width={24} height={24} />,
      status: "connecting",
      color: "#1DA1F2",
    },
  ]);

  useEffect(() => {
    const timers = connections.map((conn, index) =>
      setTimeout(() => {
        setConnections((prev) =>
          prev.map((c, i) => (i === index ? { ...c, status: "connected" } : c))
        );
      }, (index + 1) * 600)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-3 p-4 rounded-lg bg-neutral-900/60 border border-[#eac565]/20">
      {connections.map((conn) => (
        <div
          key={conn.name}
          className="flex items-center gap-3 text-sm p-2 rounded bg-neutral-800/50"
        >
          {conn.icon}
          <span className="flex-grow text-white">{conn.name}</span>
          <span
            className={`text-xs font-medium ${
              conn.status === "connected"
                ? "text-green-500"
                : "text-neutral-400"
            }`}
          >
            {conn.status === "connected" ? "Connected" : "Connecting..."}
          </span>
        </div>
      ))}
    </div>
  );
};

/** SCENE 4: Product Launch Questionnaire */
const Questionnaire = ({
  onContentUpdate,
}: {
  onContentUpdate?: () => void;
}) => {
  const questions = [
    { q: "What's your product launch date?", a: "March 15, 2025" },
    {
      q: "Who is your target audience?",
      a: "Fashion-conscious millennials aged 25-35",
    },
    {
      q: "What are your main campaign goals?",
      a: "Brand awareness and 10k pre-orders",
    },
    {
      q: "What are the key features?",
      a: "Sustainable materials, comfort technology",
    },
  ];
  const [filled, setFilled] = useState<number[]>([]);

  useEffect(() => {
    const timers = questions.map((_, index) =>
      setTimeout(() => {
        setFilled((prev) => [...prev, index]);
        setTimeout(() => onContentUpdate?.(), 50);
      }, (index + 1) * 800)
    );
    return () => timers.forEach(clearTimeout);
  }, [onContentUpdate]);

  return (
    <div className="space-y-3 p-4 rounded-lg bg-neutral-900/60 border border-[#eac565]/20">
      {questions.map((item, i) => (
        <div key={item.q} className="space-y-2">
          <div className="flex items-start gap-2">
            <AnimatePresence>
              {filled.includes(i) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex-1">
              <span
                className={`text-sm text-white ${
                  filled.includes(i) ? "" : "opacity-50"
                }`}
              >
                {item.q}
              </span>
              <AnimatePresence>
                {filled.includes(i) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mt-1 text-xs text-[#eac565] bg-neutral-800/50 p-2 rounded"
                  >
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/** Deep Research Loader */
const DeepResearchLoader = () => {
  return (
    <div className="space-y-4">
      <ResearchLoader
        title="Market Research"
        agent="Market Research Agent"
        description="Analyzing market trends..."
        delay={0}
      />
      <ResearchLoader
        title="Competitor Analysis"
        agent="Competitive Intelligence Agent"
        description="Studying top brands..."
        delay={1000}
      />
      <ResearchLoader
        title="Audience Insights"
        agent="Audience Targeting Agent"
        description="Identifying customer segments..."
        delay={2000}
      />
    </div>
  );
};

const MarketingFunnelLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1.5;
      });
    }, 60);
    return () => clearInterval(timer);
  }, []);

  const stages = [
    { name: "awareness", color: "#ff6b4a", label: "Awareness" },
    { name: "consideration", color: "#8b5cf6", label: "Consideration" },
    { name: "purchase", color: "#10b981", label: "Purchase" },
  ];

  return (
    <div className="p-3 rounded-lg bg-neutral-900/60 border border-[#eac565]/20 space-y-2 text-xs max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="p-1 rounded-full bg-[#eac565]/20"
        >
          <Loader2 className="w-3 h-3 text-[#eac565]" />
        </motion.div>
        <div className="flex-1">
          <h4 className="text-xs font-semibold text-white">
            Creating Marketing Funnel
          </h4>
          <p className="text-[10px] text-neutral-400 mt-0.5">
            Agent: Funnel Optimization
          </p>
        </div>
        <span className="text-[10px] text-[#eac565] font-medium">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="flex flex-col items-center space-y-2">
        {stages.map((stage, index) => (
          <div
            key={stage.name}
            className="flex items-center w-full max-w-[180px]"
          >
            <div className="flex-1 text-center">
              <div
                className="mx-auto mb-1"
                style={{
                  width: `${90 - index * 20}px`,
                  height: "40px",
                  background: stage.color,
                  clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
                  opacity: progress > (index + 1) * 30 ? 1 : 0.3,
                  transition: "opacity 0.5s ease",
                }}
              />
              <span
                className={`font-medium transition-colors ${
                  progress > (index + 1) * 30
                    ? "text-white"
                    : "text-neutral-500"
                }`}
              >
                {stage.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-1.5 bg-neutral-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#eac565] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <p className="text-[10px] text-neutral-300">
        Mapping customer journey stages for each funnel level...
      </p>
    </div>
  );
};

const ResearchLoader = ({
  title,
  agent,
  description,
  delay = 0,
}: {
  title: string;
  agent: string;
  description: string;
  delay?: number;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;

    const startTimeout = setTimeout(() => {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (progressInterval) clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [delay]);

  return (
    <div className="p-4 rounded-lg bg-neutral-900/60 border border-[#eac565]/20 space-y-3 md:w-[450px]">
      <div className="flex items-center gap-3">
        {progress < 100 && progress > 0 ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-2 rounded-full bg-[#eac565]/20"
          >
            <Loader2 className="w-4 h-4 text-[#eac565]" />
          </motion.div>
        ) : progress >= 100 ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-2 rounded-full bg-green-500/20"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </motion.div>
        ) : (
          <div className="p-2 rounded-full bg-neutral-700/50">
            <Loader2 className="w-4 h-4 text-neutral-500" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <span
              className={`text-xs font-medium ml-5 ${
                progress < 100 ? "text-[#eac565]" : "text-green-500"
              }`}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <p className="text-xs text-neutral-300">{description}</p>
        </div>
      </div>
      <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${
            progress < 100 ? "bg-[#eac565]" : "bg-green-500"
          } rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
      <p className="text-sm text-neutral-400 mt-1">Agent: {agent}</p>
    </div>
  );
};

const CalendarSkeleton = () => {
  const content = [
    { day: 2, title: "Launch Teaser" },
    { day: 5, title: "Product Reveal" },
    { day: 9, title: "Feature Highlight" },
    { day: 12, title: "Email Campaign" },
    { day: 16, title: "Behind the Scenes" },
    { day: 20, title: "Customer Testimonial" },
    { day: 24, title: "AMA Session" },
    { day: 28, title: "Pre-order Reminder" },
    { day: 31, title: "Launch Day!" },
  ];
  const [visibleEvents, setVisibleEvents] = useState<number[]>([]);

  useEffect(() => {
    const timers = content.map((_, i) =>
      setTimeout(() => {
        setVisibleEvents((prev) => [...prev, i]);
      }, (i + 1) * 250)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="p-2 rounded-lg bg-neutral-900/60 border border-[#eac565]/20 w-full max-w-md text-[10px]">
      <div className="flex items-center gap-2 mb-2">
        <CalendarPlus className="w-4 h-4 text-[#eac565]" />
        <h4 className="font-semibold text-white flex-1">
          Structuring Campaign Calendar...
        </h4>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: 31 }).map((_, i) => {
          const day = i + 1;
          const eventIndex = content.findIndex((c) => c.day === day);
          const event = content[eventIndex];
          return (
            <div
              key={i}
              className="aspect-square rounded-sm border border-neutral-800/50 p-0.5"
            >
              <span className="text-[9px] text-neutral-500">{day}</span>
              <AnimatePresence>
                {event && visibleEvents.includes(eventIndex) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-0.5 text-[8px] leading-tight text-[#eac565] bg-[#eac565]/10 p-0.5 rounded-sm"
                  >
                    {event.title}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GeneratedContent = ({
  onContentUpdate,
}: {
  onContentUpdate?: () => void;
}) => {
  const content = [
    {
      title: "Launch Teaser",
      type: "Reel",
      icon: Instagram,
      image: "/MockVideo1.mp4",
    },
    {
      title: "Product Reveal",
      type: "Post",
      icon: Facebook,
      image: "/ProductReveal.jpg",
    },
    {
      title: "Feature Highlight",
      type: "Tweet",
      icon: Twitter,
      image: "/FeatureHighlight.jpg",
    },
    { title: "Blog Post", type: "Blog", icon: Mail, image: "/BlogPost.png" },
    {
      title: "Launch Day Ad",
      type: "Ad",
      icon: Sparkles,
      image: "/LaunchDayAdd.jpg",
    },
    {
      title: "Behind Scenes",
      type: "Story",
      icon: Instagram,
      image: "/BehindScene.jpg",
    },
  ];

  const [generated, setGenerated] = useState<number[]>([]);

  useEffect(() => {
    const timers = content.map((_, index) => {
      return setTimeout(() => {
        setGenerated((prev) => [...prev, index]);
        setTimeout(() => onContentUpdate?.(), 50);
      }, (index + 1) * 400);
    });

    return () => timers.forEach(clearTimeout);
  }, [onContentUpdate]);

  return (
    <div className="p-4 rounded-lg bg-neutral-900/60 border border-[#eac565]/20 w-full max-w-3xl">
      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
        <CalendarDays className="w-5 h-5 text-[#eac565]" />
        Generated Campaign Content
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {content.map((item, i) => (
          <AnimatePresence key={i}>
            {generated.includes(i) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative bg-neutral-800/50 rounded-lg overflow-hidden border border-neutral-700 hover:border-[#eac565]/50 transition-colors"
              >
                <div className="aspect-video relative bg-black">
                  {item.image.endsWith(".mp4") ? (
                    <video
                      src={item.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      width={240}
                      height={240}
                    />
                  )}
                  <div className="absolute top-2 right-2">
                    <item.icon className="w-5 h-5 text-white bg-black/50 rounded p-1" />
                  </div>
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {item.type}
                  </div>
                </div>

                <div className="p-3">
                  <div className="font-semibold text-white text-sm mb-1">
                    {item.title}
                  </div>
                  <p className="text-neutral-400 text-xs">Ready to publish</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
};

const SchedulingComplete = () => {
  return (
    <motion.div
      className="p-4 rounded-lg bg-green-900/50 border border-green-500/30 flex items-center gap-3 text-white w-full max-w-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-semibold">Scheduling Complete!</h4>
        <p className="text-xs text-green-200 mt-1">
          All posts have been scheduled. Your campaign is ready to go live.
        </p>
      </div>
    </motion.div>
  );
};

export default function AutomatedChatMockup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const isDemoRunning = useRef(false);

  const demoSteps: DemoStep[] = [
    {
      id: "prompt",
      title: "Enter Prompt",
      description: "User initiates campaign creation",
      icon: MessageSquare,
      status: "pending",
    },
    {
      id: "brand-kit",
      title: "Brand Kit",
      description: "Uploading brand assets",
      icon: Package,
      status: "pending",
    },
    {
      id: "connect-accounts",
      title: "Connect Accounts",
      description: "Connecting social media",
      icon: LinkIcon,
      status: "pending",
    },
    {
      id: "questionnaire",
      title: "Campaign Details",
      description: "Gather campaign requirements",
      icon: Settings,
      status: "pending",
    },
    {
      id: "deep-research",
      title: "Deep Research",
      description: "Market, Competitor & Audience",
      icon: BrainCircuit,
      status: "pending",
    },
    {
      id: "marketing-funnel",
      title: "Marketing Funnel",
      description: "Strategizing customer journey",
      icon: GitMerge,
      status: "pending",
    },
    {
      id: "generate-calendar",
      title: "Generate Calendar",
      description: "Structuring the campaign plan",
      icon: CalendarPlus,
      status: "pending",
    },
    {
      id: "content-generation",
      title: "Content Generation",
      description: "Creating posts and assets",
      icon: CalendarDays,
      status: "pending",
    },
    {
      id: "execution",
      title: "Campaign Ready",
      description: "Ready to publish and schedule",
      icon: CheckCircle,
      status: "pending",
    },
  ];

  const [steps, setSteps] = useState<DemoStep[]>(demoSteps);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const activeIndex = steps.findIndex((step) => step.status === "active");
    if (activeIndex !== -1) {
      scrollToStep(activeIndex);
    }
  }, [steps]);

  const scrollToStep = (index: number) => {
    if (stepRefs.current[index] && carouselRef.current) {
      const stepElement = stepRefs.current[index];
      const container = carouselRef.current;

      const stepLeft = stepElement.offsetLeft;
      const stepWidth = stepElement.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollLeft = stepLeft - containerWidth / 2 + stepWidth / 2;

      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  };

  const updateStepStatus = (
    stepIndex: number,
    status: "pending" | "active" | "completed"
  ) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === stepIndex ? { ...step, status } : step))
    );
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

  const runAutomatedDemo = React.useCallback(async () => {
    if (isDemoRunning.current) return;
    isDemoRunning.current = true;

    const addMessage = (
      role: "user" | "assistant",
      content: Partial<Message>
    ) => {
      setMessages((prev) => [...prev, { id: uid(role), role, ...content }]);
    };

    // New helper to add streaming text and wait for it to finish
    const addStreamingText = (text: string) => {
      return new Promise<void>((resolve) => {
        addMessage("assistant", {
          component: (
            <StreamingTextMessage
              text={text}
              onComplete={resolve}
              scroll={scrollToBottom}
            />
          ),
        });
      });
    };

    // START DEMO
    await new Promise((r) => setTimeout(r, 1000));
    setHasStarted(true);
    await new Promise((r) => setTimeout(r, 1200));

    // STEP 1: Enter Prompt
    updateStepStatus(0, "active");
    addMessage("user", {
      text: "Can you create a 5-week sustainable shoe launch campaign for my brand targeting millennials?",
    });
    await new Promise((r) => setTimeout(r, 1500));
    updateStepStatus(0, "completed");

    await addStreamingText(
      "I can do that! Let's start by setting up your brand profile."
    );
    await new Promise((r) => setTimeout(r, 500));

    // STEP 2: Brand Kit
    updateStepStatus(1, "active");
    await addStreamingText(
      "First, please upload your brand kit (guidelines, logos, etc.)."
    );
    addMessage("assistant", { component: <BrandKitUpload /> });
    await new Promise((r) => setTimeout(r, 4500));
    addMessage("user", { text: "All uploaded!" });
    await new Promise((r) => setTimeout(r, 1500));
    updateStepStatus(1, "completed");

    // STEP 3: Connect Accounts
    updateStepStatus(2, "active");
    await addStreamingText(
      "Great! Now let's connect your social media accounts:"
    );
    addMessage("assistant", { component: <SocialMediaConnect /> });
    await new Promise((r) => setTimeout(r, 4000));
    addMessage("user", {
      text: "Connected! Instagram and Facebook are my main channels.",
    });
    await new Promise((r) => setTimeout(r, 1500));
    updateStepStatus(2, "completed");

    // STEP 4: Campaign Details
    updateStepStatus(3, "active");
    await addStreamingText("Perfect! Now, tell me about your launch details:");
    addMessage("assistant", {
      component: <Questionnaire onContentUpdate={scrollToBottom} />,
    });
    await new Promise((r) => setTimeout(r, 5000));
    addMessage("user", { text: "All set! Ready for the magic." });
    await new Promise((r) => setTimeout(r, 1500));
    updateStepStatus(3, "completed");

    // STEP 5: Deep Research
    updateStepStatus(4, "active");
    await addStreamingText(
      "Understood. Kicking off a deep research phase to analyze your market, competitors, and audience."
    );
    addMessage("assistant", { component: <DeepResearchLoader /> });
    await new Promise((r) => setTimeout(r, 5000));
    updateStepStatus(4, "completed");

    // STEP 6: Marketing Funnel
    updateStepStatus(5, "active");
    await addStreamingText(
      "Research complete. Now, building a marketing funnel to guide your audience from awareness to purchase."
    );
    addMessage("assistant", { component: <MarketingFunnelLoader /> });
    await new Promise((r) => setTimeout(r, 4500));
    updateStepStatus(5, "completed");

    // STEP 7: Generate Calendar
    updateStepStatus(6, "active");
    await addStreamingText(
      "Funnel strategy is set. Now generating the content calendar structure with key events."
    );
    addMessage("assistant", { component: <CalendarSkeleton /> });
    await new Promise((r) => setTimeout(r, 4000));
    updateStepStatus(6, "completed");

    // STEP 8: Content Generation
    updateStepStatus(7, "active");
    await addStreamingText(
      "Calendar structured! Now populating it with engaging content and visuals."
    );
    addMessage("assistant", {
      component: <GeneratedContent onContentUpdate={scrollToBottom} />,
    });
    await new Promise((r) => setTimeout(r, 4000));
    updateStepStatus(7, "completed");

    // STEP 9: Campaign Ready
    updateStepStatus(8, "active");
    addMessage("user", {
      text: "This is amazing! Please schedule everything automatically.",
    });
    await new Promise((r) => setTimeout(r, 1500));
    await addStreamingText(
      "Of course! Scheduling all posts for the campaign now..."
    );
    await new Promise((r) => setTimeout(r, 3000));
    addMessage("assistant", { component: <SchedulingComplete /> });
    await new Promise((r) => setTimeout(r, 1000));
    updateStepStatus(8, "completed");
  }, []);

  useEffect(() => {
    if (isInView) {
      runAutomatedDemo();
    }
  }, [isInView, runAutomatedDemo]);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8"
      id="working"
    >
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-4xl md:text-5xl text-white font-light mb-3 sm:mb-4">
          How{" "}
          <span className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
            Super Caspr
          </span>{" "}
          Works
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg">
          Watch AI create your complete marketing campaign step by step
        </p>
      </div>

      <div className="flex flex-col pt-10 lg:grid lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Progress Sidebar */}
        <div className="lg:col-span-1 lg:mt-18">
          {/* Mobile Carousel */}
          <div className="lg:hidden relative">
            <div
              ref={carouselRef}
              className="overflow-x-auto scrollbar-hide pb-4 mt-2 scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="flex space-x-4 min-w-max px-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.status === "active";
                  const isCompleted = step.status === "completed";

                  return (
                    <motion.div
                      key={step.id}
                      ref={(el) => {
                        stepRefs.current[index] = el;
                      }}
                      className={`relative flex-shrink-0 w-40 cursor-pointer select-none transition-all duration-300 mt-2 ${
                        isActive
                          ? "opacity-100 scale-105 z-50"
                          : isCompleted
                          ? "opacity-70"
                          : "opacity-40"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 120,
                      }}
                      onClick={() => scrollToStep(index)}
                    >
                      <div
                        className={`bg-neutral-900/50 rounded-lg p-4 border transition-all duration-300 ${
                          isActive
                            ? "border-[#eac565]/50"
                            : "border-neutral-700/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="relative">
                            <div
                              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                                isCompleted
                                  ? "bg-[#efbd65] border-[#e6c48a] shadow-[0_0_15px_rgba(234,197,101,0.7)]"
                                  : isActive
                                  ? "bg-[#eac565] border-[#eac565] scale-110 shadow-[0_0_15px_rgba(234,197,101,0.7)]"
                                  : "bg-black border-gray-600"
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-4 h-4 text-black" />
                              ) : (
                                <Icon
                                  className={`w-4 h-4 ${
                                    isActive ? "text-black" : "text-gray-400"
                                  }`}
                                />
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-neutral-400">
                            {index + 1}/{steps.length}
                          </span>
                        </div>
                        <h3
                          className={`text-sm font-medium transition-colors duration-300 mb-1 ${
                            isActive
                              ? "text-white"
                              : isCompleted
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Vertical Layout */}
          <div className="hidden lg:block space-y-1 sticky top-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.status === "active";
              const isCompleted = step.status === "completed";

              return (
                <motion.div
                  key={step.id}
                  className={`relative pl-8 py-2 cursor-pointer select-none transition-all duration-300 ${
                    isActive
                      ? "opacity-100"
                      : isCompleted
                      ? "opacity-70"
                      : "opacity-40"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 120,
                  }}
                >
                  {index < steps.length - 1 && (
                    <div className="absolute left-[8px] top-5 h-full w-px bg-gray-700" />
                  )}
                  <div className="absolute -left-0.5 top-2.5 z-10">
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isCompleted
                          ? "bg-[#efbd65] border-[#e6c48a] !w-4 !h-4"
                          : isActive
                          ? "bg-[#eac565] border-[#eac565] scale-125 shadow-[0_0_15px_rgba(234,197,101,0.7)]"
                          : "bg-black border-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <></>
                      ) : (
                        <Icon
                          className={`w-3 h-3 ${
                            isActive ? "text-black" : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                  <h3
                    className={`text-[15px] font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-white"
                        : isCompleted
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, y: -3 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -3 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs text-gray-400"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Chat Demo */}
        <div className="lg:col-span-3">
          <motion.div
            layout
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className={`relative rounded-xl sm:rounded-2xl bg-gradient-to-b from-neutral-950 to-neutral-900 shadow-lg sm:shadow-2xl border border-[#eac565]/10 h-[400px] sm:h-[500px]
            ${
              hasStarted
                ? "p-0"
                : "p-4 sm:p-10 flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px]"
            }`}
          >
            <AnimatePresence>
              {!hasStarted ? (
                <motion.div
                  key="initial-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-3xl text-center h-[400px] sm:h-[500px]"
                >
                  <motion.div layoutId="header-layout">
                    <h3 className="text-center text-xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                      <span className="bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                        AI Campaign
                      </span>{" "}
                      <span className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
                        Assistant
                      </span>
                    </h3>
                    <p className="text-neutral-400 text-base sm:text-lg mb-6 sm:mb-8">
                      Your AI Content and Marketing Team
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-neutral-500">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#eac565]" />
                      <span>Demo starting...</span>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="chat-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col h-[400px] sm:h-[500px] w-full"
                >
                  <motion.div
                    layoutId="header-layout"
                    className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#eac565]/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">
                        <Avatar className="size-7">
                          <AvatarImage src="/Logo4.png" alt="Bot Avatar" />
                          <AvatarFallback className="bg-neutral-800 text-white font-bold">
                            BOT
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-white">
                          Casspr AIR
                        </div>
                        <div className="text-xs text-neutral-400">
                          Creating your campaign...
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div
                    ref={listRef}
                    className="flex-grow overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4"
                    style={{ scrollbarGutter: "stable" }}
                  >
                    <AnimatePresence>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className={`flex ${
                            msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {msg.role === "assistant" ? (
                            <div className="flex items-start gap-2 sm:gap-3 max-w-[90%]">
                              <div className="p-2 rounded-full flex-shrink-0">
                                <Avatar className="size-6">
                                  <AvatarImage
                                    src="/Logo4.png"
                                    alt="Bot Avatar"
                                  />
                                  <AvatarFallback className="bg-neutral-800 text-white font-bold">
                                    BOT
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="space-y-2 sm:space-y-3">
                                {msg.component}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-end gap-2 sm:gap-3 max-w-[85%]">
                              <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm bg-[#BC853B] text-neutral-200 font-medium">
                                {msg.text}
                              </div>
                              <Avatar>
                                <AvatarImage src={"/mockUser.png"} alt="user" />
                                <AvatarFallback className="flex h-10 w-10 bg-neutral-100 rounded-full items-center justify-center text-sm font-medium">
                                  {"USER"}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
