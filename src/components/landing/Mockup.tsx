"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  PenSquare,
  Sparkles,
  Mail,
  Search,
  TrendingUp,
  Users,
  Target,
  Loader2,
  CheckCircle,
} from "lucide-react";

// ========== TYPE DEFINITION ==========
type Message = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  component?: React.ReactNode;
};

// ========== UI SIMULATION COMPONENTS ==========

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
            <CheckCircle2 className="w-4 h-4 text-[#eac565]" />
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
      icon: Instagram,
      status: "connecting",
      color: "#E1306C",
    },
    {
      name: "Facebook",
      icon: Facebook,
      status: "connecting",
      color: "#1877F2",
    },
    { name: "Twitter", icon: Twitter, status: "connecting", color: "#1DA1F2" },
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
          <conn.icon className="w-4 h-4" style={{ color: conn.color }} />
          <span className="flex-grow text-white">{conn.name}</span>
          <span
            className={`text-xs font-medium ${
              conn.status === "connected"
                ? "text-[#eac565]"
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
const Questionnaire = () => {
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
      setTimeout(() => setFilled((prev) => [...prev, index]), (index + 1) * 800)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

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
                  <CheckCircle2 className="w-4 h-4 text-[#eac565] mt-0.5" />
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

/** Research Loading Components */
const ResearchLoader = ({
  title,
  agent,
  description,
}: {
  title: string;
  agent: string;
  description: string;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 rounded-lg bg-neutral-900/60 border border-[#eac565]/20 space-y-3 w-[450px]">
      <div className="flex items-center gap-3">
        {progress < 100 ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-2 rounded-full bg-[#eac565]/20"
          >
            <Loader2 className="w-4 h-4 text-[#eac565]" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-2 rounded-full bg-green-500/20"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </motion.div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <span
              className={`text-xs font-medium ml-5 ${
                progress < 100 ? "text-[#eac565]" : "text-green-500"
              }`}
            >
              {progress}%
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
          transition={{ duration: 0.3 }}
        />
      </div>

      <p className="text-sm text-neutral-400 mt-1">Agent: {agent}</p>
    </div>
  );
};

/** Marketing Funnel Loader */
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
    <div className="p-6 rounded-lg bg-neutral-900/60 border border-[#eac565]/20 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="p-2 rounded-full bg-[#eac565]/20"
        >
          <Loader2 className="w-4 h-4 text-[#eac565]" />
        </motion.div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white">
            Creating Marketing Funnel Strategy
          </h4>
          <p className="text-xs text-neutral-400 mt-1">
            Agent: Funnel Optimization Agent
          </p>
        </div>
        <span className="text-xs text-[#eac565] font-medium">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.name} className="flex items-center w-full max-w-sm">
            <div className="flex-1 text-center">
              <div
                className="mx-auto mb-2"
                style={{
                  width: `${120 - index * 30}px`,
                  height: "60px",
                  background: stage.color,
                  clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
                  opacity: progress > (index + 1) * 30 ? 1 : 0.3,
                  transition: "opacity 0.5s ease",
                }}
              />
              <span
                className={`text-xs font-medium transition-colors ${
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

      <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#eac565] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <p className="text-xs text-neutral-300">
        Mapping customer journey stages and optimizing content for each funnel
        level...
      </p>
    </div>
  );
};

/** Enhanced Campaign Calendar */
const CampaignCalendar = () => {
  const content = [
    {
      title: "Launch Teaser",
      type: "Reel",
      icon: Instagram,
      prompt:
        "Create an Instagram Reel showcasing sustainable shoe manufacturing process with earth tones and minimalist aesthetics",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&crop=center",
    },
    {
      title: "Product Reveal",
      type: "Post",
      icon: Facebook,
      prompt:
        "Design a Facebook post featuring the new sustainable shoe collection with lifestyle photography and eco-friendly messaging",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&crop=center",
    },
    {
      title: "Feature Highlight",
      type: "Tweet",
      icon: Twitter,
      prompt:
        "Craft a Twitter thread highlighting the comfort technology and sustainable materials used in the shoes",
      image:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop&crop=center",
    },
    {
      title: "Email Campaign",
      type: "Email",
      icon: Mail,
      prompt:
        "Design an email newsletter announcing the launch with exclusive early access for subscribers",
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop&crop=center",
    },
    {
      title: "Launch Day Ad",
      type: "Ad",
      icon: Sparkles,
      prompt:
        "Create a dynamic launch day advertisement emphasizing sustainability and style for millennial audience",
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&crop=center",
    },
    {
      title: "Behind Scenes",
      type: "Story",
      icon: Instagram,
      prompt:
        "Develop Instagram Stories showing behind-the-scenes content of the sustainable production process",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center",
    },
  ];
  const [generated, setGenerated] = useState<number[]>([]);

  useEffect(() => {
    const timers = content.map((_, index) =>
      setTimeout(() => {
        setGenerated((prev) => [...prev, index]);
      }, (index + 1) * 400)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="p-4 rounded-lg bg-neutral-900/60 border border-[#eac565]/20 w-full max-w-4xl">
      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
        <CalendarDays className="w-5 h-5 text-[#eac565]" />
        Generated Campaign Content
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        initial="hidden"
        animate="visible"
      >
        {content.map((item, i) => (
          <motion.div
            key={item.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="relative bg-neutral-800/50 rounded-lg overflow-hidden border border-neutral-700 hover:border-[#eac565]/50 transition-colors"
          >
            <div className="aspect-video relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <item.icon className="w-5 h-5 text-white bg-black/50 rounded p-1" />
              </div>
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {item.type}
              </div>
            </div>
            <div className="p-3">
              <div className="font-semibold text-white text-sm mb-2">
                {item.title}
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                {item.prompt}
              </p>
            </div>
            <AnimatePresence>
              {generated.includes(i) && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-[#eac565] rounded-full p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <CheckCircle2 className="w-3 h-3 text-neutral-900" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
export default function AutomatedChatMockup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const isDemoRunning = useRef(false);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

  const runAutomatedDemo = async () => {
    if (isDemoRunning.current) return;
    isDemoRunning.current = true;

    const addMessage = (
      role: "user" | "assistant",
      content: Partial<Message>
    ) => {
      setMessages((prev) => [...prev, { id: uid(role), role, ...content }]);
    };

    // START DEMO
    await new Promise((r) => setTimeout(r, 1000));
    setHasStarted(true);
    await new Promise((r) => setTimeout(r, 1200));

    // SCENE 1: User Initiates Chat
    addMessage("user", {
      text: "Can you create a 5-week campaign for my sustainable shoe launch?",
    });
    await new Promise((r) => setTimeout(r, 2000));

    addMessage("assistant", {
      text: "Absolutely! Let's start by setting up your brand profile.",
    });
    await new Promise((r) => setTimeout(r, 3000));

    // SCENE 2: Brand Profile & Brand Kit Upload
    addMessage("assistant", {
      text: "Please upload your brand kit, logo, or website so I can learn your identity.",
      component: <BrandKitUpload />,
    });
    await new Promise((r) => setTimeout(r, 4500));

    addMessage("user", {
      text: "Uploaded! We focus on sustainability and comfort.",
    });
    await new Promise((r) => setTimeout(r, 2000));

    // SCENE 3: Social Media Integration
    addMessage("assistant", {
      text: "Great! Connect your social accounts so I can align with each platform.",
      component: <SocialMediaConnect />,
    });
    await new Promise((r) => setTimeout(r, 4000));

    addMessage("user", {
      text: "Done. Instagram and Facebook are my main channels.",
    });
    await new Promise((r) => setTimeout(r, 2000));

    // SCENE 4: Product Launch Questionnaire
    addMessage("assistant", {
      text: "Tell me a bit about your launch to refine the strategy.",
      component: <Questionnaire />,
    });
    await new Promise((r) => setTimeout(r, 5000));

    addMessage("user", {
      text: "All filled in! Excited to see results.",
    });
    await new Promise((r) => setTimeout(r, 2000));

    // SCENE 5: Market Research
    addMessage("assistant", {
      text: "Running research on your market, competitors, and audience...",
    });
    await new Promise((r) => setTimeout(r, 2000));

    addMessage("assistant", {
      component: (
        <ResearchLoader
          title="Market Research"
          agent="Market Agent"
          description="Analyzing trends and behavior..."
        />
      ),
    });
    await new Promise((r) => setTimeout(r, 4000));

    // SCENE 6: Competitive Analysis
    addMessage("assistant", {
      component: (
        <ResearchLoader
          title="Competitor Analysis"
          agent="Competitor Agent"
          description="Reviewing top sustainable brands..."
        />
      ),
    });
    await new Promise((r) => setTimeout(r, 4000));

    // SCENE 7: Audience Research
    addMessage("assistant", {
      component: (
        <ResearchLoader
          title="Audience Insights"
          agent="Audience Agent"
          description="Finding your ideal segments..."
        />
      ),
    });
    await new Promise((r) => setTimeout(r, 4000));

    // SCENE 8: Marketing Funnel Creation
    addMessage("assistant", {
      text: "Creating your marketing funnel...",
    });
    await new Promise((r) => setTimeout(r, 2000));

    addMessage("assistant", {
      component: <MarketingFunnelLoader />,
    });
    await new Promise((r) => setTimeout(r, 5000));

    // SCENE 9: Campaign Calendar Generation
    addMessage("assistant", {
      text: "Here’s your full campaign calendar with ready-to-go content!",
    });
    await new Promise((r) => setTimeout(r, 2000));

    addMessage("assistant", {
      component: <CampaignCalendar />,
    });
    await new Promise((r) => setTimeout(r, 3000));

    addMessage("user", {
      text: "This looks perfect for my brand!",
    });
    await new Promise((r) => setTimeout(r, 2000));

    addMessage("assistant", {
      text: "All content is tailored to your guidelines and platforms. You can edit, schedule, or publish instantly. Ready to launch!",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runAutomatedDemo();
    }, 500);

    return () => {
      clearTimeout(timer);
      isDemoRunning.current = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-8">
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl text-white font-light">
          How{" "}
          <span className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
            Super Casspr
          </span>{" "}
          Works
        </h2>
      </div>
      <motion.div
        layout
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className={`relative rounded-2xl bg-gradient-to-b from-neutral-950 to-neutral-900 shadow-2xl border border-[#eac565]/10 min-h-[400px]
      ${
        hasStarted
          ? "p-0"
          : "p-10 flex flex-col items-center justify-center min-h-[400px]" // reduced from 600px
      }`}
      >
        <AnimatePresence>
          {!hasStarted ? (
            <motion.div
              key="initial-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl text-center"
            >
              <motion.div layoutId="header-layout">
                <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-8">
                  <span className="bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                    Automated
                  </span>{" "}
                  <span className="bg-gradient-to-r from-[#eac565] to-yellow-400 bg-clip-text text-transparent">
                    Campaigns
                  </span>
                </h2>
                <p className="text-neutral-400 text-lg">
                  Watch how AI creates your entire marketing campaign in minutes
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col h-[500px] w-full" // reduced from 700px
            >
              <motion.div
                layoutId="header-layout"
                className="px-6 py-4 border-b border-[#eac565]/10 flex items-center justify-between"
              >
                <div className="text-sm text-[#eac565] font-medium">
                  Campaign AI Assistant
                </div>
                <div className="text-xs text-neutral-500">
                  Live Demo Running
                </div>
              </motion.div>

              <div
                ref={listRef}
                className="flex-grow overflow-y-auto px-6 py-6 space-y-4"
                style={{ scrollbarGutter: "stable" }}
              >
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="flex items-start gap-3 max-w-[85%]">
                          <div className="p-2 rounded-full bg-gradient-to-br from-[#eac565] to-yellow-600 flex-shrink-0">
                            <BotIcon className="text-neutral-900 w-5 h-5" />
                          </div>
                          <div className="space-y-3">
                            {msg.text && (
                              <div className="rounded-xl px-4 py-3 text-sm text-white bg-gradient-to-b from-neutral-800/60 to-neutral-900/60 border border-[#eac565]/10">
                                {msg.text}
                              </div>
                            )}
                            {msg.component}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-end gap-3 max-w-[85%]">
                          <div className="rounded-xl px-4 py-3 text-sm bg-[#eac565]/20 text-white border border-[#eac565]/20">
                            {msg.text}
                          </div>
                          <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                          </div>
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
    </section>
  );
}
