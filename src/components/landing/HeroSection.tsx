import React from "react";
import { motion, Variants } from "framer-motion"; // 1. Import the 'Variants' type
import Image from "next/image";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { TypeAnimation } from "react-type-animation";
import FadingSentences from "./FadingSentences";

export default function HeroSection() {
  // Define animation variants for a staggered effect
  const containerVariants: Variants = {
    // 2. Apply the Variants type
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    // 3. Apply the Variants type
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen text-center px-4 space-y-16"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex">
        <Image
          src="/Logo.svg"
          alt="logo"
          width={1280}
          height={800}
          className="opacity-50"
        />
        <span className="text-[#BC853B] font-bold opacity-40 text-3xl">
          Super
        </span>
      </motion.div>

      <motion.div className="relative w-full max-w-2xl" variants={itemVariants}>
        {/* This parent div creates the gradient border */}
        <div className="relative rounded-full p-[1px] bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700">
          <input
            type="text"
            placeholder="Start with your content...."
            className="relative w-full rounded-full  border-transparent py-3 px-6 text-white placeholder:text-gray-400 focus:outline-none focus:ring-transparent pr-16"
          />

          <button className="absolute top-1/2 -translate-y-1/2 right-1 h-10 w-10 flex items-center justify-center rounded-full bg-[#111111] text-white hover:bg-[#4A4A4C] transition-colors">
            <Send size={20} />
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          variant="primary"
          className="bg-white text-neutral-800 px-8 py-3 rounded-full hover:bg-neutral-100 cursor-pointer"
        >
          Create Account
        </Button>
      </motion.div>

      <FadingSentences />
    </motion.div>
  );
}
