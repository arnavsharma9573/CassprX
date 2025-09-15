"use client";

import React, { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type MessageInputProps = {
  placeholder?: string;
  onSend?: (text: string) => Promise<void> | void;
  className?: string;
};

export default function MessageInput({
  placeholder = "Message Casper AI...",
  onSend,
  className = "",
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    try {
      setIsSending(true);
      await onSend?.(trimmed);
      setText("");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-4xl mx-auto px-2 sm:px-4 ${className}`}
    >
      <div
        className={`group relative flex flex-col sm:flex-row gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 rounded-2xl
          bg-gradient-to-br from-neutral-900/95 to-neutral-900/70
          backdrop-blur-xl border-2 transition-all duration-300 shadow-lg
          ${
            isFocused
              ? "border-emerald-500/60 shadow-emerald-500/20"
              : "border-white/10 hover:border-white/20"
          }`}
      >
        {/* Agent Select */}
        <div className="w-full sm:w-52 relative z-10">
          <Select>
            <SelectTrigger
              className="h-11 w-full rounded-xl px-3 sm:px-4 text-sm text-slate-200 
                bg-neutral-800/60 border border-slate-600/40 
                shadow-inner hover:bg-neutral-800/80 
                focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50
                transition-all duration-200"
            >
              <SelectValue placeholder="Select an Agent" />
            </SelectTrigger>
            <SelectContent
              className="bg-neutral-900/95 backdrop-blur-xl border border-slate-700/50 
                shadow-2xl rounded-xl overflow-hidden animate-in fade-in-0 
                zoom-in-95 duration-200"
            >
              <SelectGroup>
                <SelectLabel className="px-3 py-2 text-xs uppercase tracking-wide text-slate-400">
                  Agents
                </SelectLabel>
                <SelectItem value="content-calendar">
                  Content Calendar
                </SelectItem>
                <SelectItem value="casprx">Casprx</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Textarea */}
        <div className="flex-1 relative z-10">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={1}
            placeholder={placeholder}
            className="w-full min-h-[44px] max-h-40 resize-none bg-transparent
              placeholder:text-slate-500 text-white text-sm
              outline-none px-3 py-2 rounded-lg
              border border-slate-700/40 hover:border-slate-500/50
              focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40
              transition-all duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>

        {/* Send button */}
        <div className="flex justify-end sm:justify-center items-center relative z-10">
          <button
            type="submit"
            disabled={text.trim().length === 0 || isSending}
            className={`flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-300
              ${
                text.trim().length === 0 || isSending
                  ? "bg-neutral-700/60 cursor-not-allowed opacity-60 border border-slate-600/40"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-500 \
                    hover:from-emerald-500 hover:to-emerald-400 \
                    shadow-lg shadow-emerald-500/25"
              }`}
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Character counter */}
      {text.length > 0 && (
        <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 px-2 text-xs text-slate-400">
          <span>
            {text.length > 500 ? (
              <span className="text-amber-400">
                {text.length}/1000 characters
              </span>
            ) : (
              `${text.length} characters`
            )}
          </span>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-slate-300">
              Enter
            </kbd>
            <span>send</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-slate-300">
              Shift+Enter
            </kbd>
            <span>newline</span>
          </div>
        </div>
      )}
    </form>
  );
}
