import React from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={disabled ? "Processing..." : "Type your message..."}
        className={`w-full px-6 py-4 pr-14 bg-neutral-900/50 border border-neutral-700/50 rounded-4xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#E6A550] focus:ring-2 focus:ring-[#E6A550]/20 transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full transition-all ${
          disabled || !value.trim()
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg hover:shadow-[#E6A550]/20 hover:scale-105"
        }`}
      >
        <Send className="w-5 h-5 text-black" />
      </button>
    </form>
  );
}
