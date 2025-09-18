import React, { useState } from "react";

type ChatInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function ChatInput({ value, onChange, onSubmit }: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="relative group">
        {/* Input Container with enhanced styling */}
        <div className={`
          relative w-full rounded-4xl transition-all duration-200 ease-out
          ${isFocused 
            ? 'bg-neutral-800/80 shadow-2xl shadow-[#E6A550]/10 ring-2 ring-[#E6A550]/50' 
            : 'bg-neutral-800/60 shadow-lg hover:bg-neutral-800/70'
          }
          backdrop-blur-xl border border-neutral-700/50 hover:border-neutral-600/50
        `}>
          
          {/* Animated glow effect */}
          <div className={`
            absolute inset-0 rounded-2xl transition-opacity duration-200
            ${isFocused ? 'opacity-100' : 'opacity-0'}
            bg-gradient-to-r from-[#E6A550]/5 via-transparent to-[#BC853B]/5
          `} />
          
          <input
            type="text"
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask a follow-up question..."
            className="
              w-full text-base sm:text-lg px-5 py-4 pr-16 rounded-2xl
              bg-transparent text-white placeholder-neutral-400
              focus:outline-none relative z-10
              transition-all duration-200
            "
            autoComplete="off"
          />
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!value.trim()}
            className={`
              absolute right-2 top-1/2 -translate-y-1/2 
              w-10 h-10 rounded-xl
              flex items-center justify-center
              transition-all duration-200 ease-out
              ${value.trim() 
                ? 'bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-[#E6A550]/90 hover:to-[#BC853B]/90 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-[#E6A550]/25' 
                : 'bg-neutral-600 cursor-not-allowed'
              }
            `}
          >
            {/* Send Icon with animation */}
            <div className={`
              transition-transform duration-200
              ${value.trim() ? 'group-hover:scale-110' : ''}
            `}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`
                  transition-colors duration-200
                  ${value.trim() ? 'text-white' : 'text-neutral-400'}
                `}
              >
                <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.843 7.627a.498.498 0 0 0 .683.627l18-8.5a.5.5 0 0 0 0-.904z" />
                <path d="M6 12h16" />
              </svg>
            </div>
          </button>
        </div>
        
        {/* Subtle typing indicator dots (optional)
        <div className="flex justify-center mt-3 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-neutral-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-neutral-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1 h-1 bg-neutral-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div> */}
      </form>
    </div>
  );
}