"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BotIcon } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import MessageInput from "./MockmessageInput";

/**
 * ChatStreamMockupAuto (with Shadcn Dropdown in MessageInput)
 * - No modal; dropdown menu is inside MessageInput
 */

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  streaming?: boolean;
};

export default function ChatStreamMockupAuto() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [autoStarted, setAutoStarted] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      setTimeout(
        () => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }),
        40
      );
    }
  }, [messages]);

  const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

  // Simulated streaming
  async function simulateAiStream(
    prompt: string,
    onChunk: (chunk: string) => void
  ) {
    const full = [
      `Got your request: ${prompt}`,
      "Here's a polished, short landing blurb tailored for the product.",
      "Casper AI turns your ideas into actions — instantly publish, route, and automate content across all platforms.",
      "Fast, secure, and enterprise-ready.",
    ].join(" ");

    const words = full.split(" ");
    let i = 0;
    while (i < words.length) {
      const chunkSize = 4 + Math.floor(Math.random() * 6);
      const chunk =
        words.slice(i, i + chunkSize).join(" ") +
        (i + chunkSize < words.length ? " " : "");
      onChunk(chunk);
      i += chunkSize;
      await new Promise((r) => setTimeout(r, 80 + Math.random() * 200));
    }
  }

  const sendFromInput = async (text: string) => {
    if (!text.trim()) return;

    const userId = uid("u_");
    const assistantId = uid("a_");

    // 1️⃣ Add user message
    setMessages((m) => [
      ...m,
      { id: userId, role: "user", text, streaming: false },
    ]);

    // 2️⃣ Add placeholder assistant bubble ("Thinking…")
    setMessages((m) => [
      ...m,
      {
        id: assistantId,
        role: "assistant",
        text: "Thinking…",
        streaming: true,
      },
    ]);

    // 3️⃣ Wait 2s → update same bubble to "Generating…"
    await new Promise((r) => setTimeout(r, 2000));
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantId
          ? { ...msg, text: "Generating your response…" }
          : msg
      )
    );

    // 4️⃣ Wait another 3s → clear text, prep for streaming
    await new Promise((r) => setTimeout(r, 3000));
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantId ? { ...msg, text: "", streaming: true } : msg
      )
    );

    // 5️⃣ Stream reply into SAME bubble
    await simulateAiStream(text, (chunk) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId ? { ...msg, text: msg.text + chunk } : msg
        )
      );
    });

    // 6️⃣ Mark streaming complete
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantId ? { ...msg, streaming: false } : msg
      )
    );
  };

  // Auto demo on first view
  async function startAutoDemo() {
    if (autoStarted) return;
    setAutoStarted(true);

    const userPrompt =
      "Write a short landing blurb for Casper AI that emphasizes speed and integrations.";
    await new Promise((r) => setTimeout(r, 250));
    await sendFromInput(userPrompt);
  }

  // Observe viewport
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTimeout(() => startAutoDemo(), 300);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 }
    );

    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrapperRef.current]);

  const bubbleVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  };

  return (
    <section ref={wrapperRef} className="mx-auto max-w-5xl px-6 py-14">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45 }}
        className="text-center text-4xl md:text-5xl font-extrabold mb-8"
      >
        <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
          Agent for
        </span>{" "}
        <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
          Every Task
        </span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, delay: 0.06 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-black/80 to-black/90 shadow-2xl border border-white/6"
      >
        <div className="px-6 py-4 border-b border-white/6 flex items-center justify-between">
          <div>
            <div className="text-sm text-blue-300">Casper AI</div>
          </div>
          <div className="text-xs text-slate-400">Realtime</div>
        </div>

        {/* Chat messages */}
        <div
          ref={listRef}
          className="h-[420px] overflow-y-auto px-6 py-6 space-y-4"
          style={{ scrollbarGutter: "stable" }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={bubbleVariants}
                transition={{ duration: 0.28 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="flex items-start gap-3 max-w-[78%]">
                    <div className="p-2 rounded-full bg-gradient-to-br from-blue-600 to-slate-900 flex items-center justify-center shadow-sm">
                      <BotIcon className="text-white" />
                    </div>
                    <div className="relative">
                      <div className="rounded-xl px-4 py-3 text-sm leading-relaxed text-white bg-gradient-to-b from-white/3 to-transparent border border-white/6 backdrop-blur-sm">
                        {["Thinking", "Generating your response"].includes(
                          msg.text
                        ) ? (
                          <div className="flex items-center gap-2">
                            <span>{msg.text}</span>
                            <span className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s]" />
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]" />
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                            </span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap break-words">
                            {msg.text}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end gap-3 max-w-[78%] justify-end">
                    <div className="relative">
                      <div className="rounded-xl px-4 py-3 text-sm leading-relaxed bg-blue-600/80 text-white border border-blue-500/20">
                        {msg.text}
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-sm text-slate-300 border border-white/6">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                      </Avatar>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/6 flex items-center gap-3">
          <MessageInput
            onSend={async (text) => {
              await sendFromInput(text);
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
