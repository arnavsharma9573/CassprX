import React from "react";
import { motion, Variants } from "framer-motion"; // 1. Import the 'Variants' type
import Image from "next/image";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { TypeAnimation } from "react-type-animation";
import FadingSentences from "./FadingSentences";
import Link from "next/link";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const placeholders = [
    "What's your next campaign idea?",
    "Who is your target audience today?",
    "Where should your brand go next?",
    "Write a catchy caption for Instagram",
    "How to plan a full campaign in minutes?",
  ];

  const containerVariants: Variants = {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/auth/login");
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen text-center px-4 space-y-16"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex mt-48">
        <Image
          src="/Logo.svg"
          alt="logo"
          width={1280}
          height={800}
          className="opacity-80"
        />
        <span className="hidden md:flex text-[#BC853B] font-bold opacity-40 text-3xl">
          AIR <sup className="mt-5">&copy;</sup>
        </span>
      </motion.div>

      <motion.div className="relative w-full max-w-2xl" variants={itemVariants}>
        {/* This parent div creates the gradient border */}
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="space-x-2 md:z-40">
        <Button className="bg-white text-black hover:bg-neutral-50 px-6 py-3 rounded-full shadow-xl shadow-white/10 cursor-pointer">
          <Link href="#agent-directory">Agents Directory</Link>
        </Button>
        <Button
          variant="ghost"
          className="text-slate-200 px-4 py-2 rounded-full cursor-pointer"
        >
          <Link href="#working">Demo Video</Link>
        </Button>
      </motion.div>

      <FadingSentences />
    </motion.div>
  );
}
