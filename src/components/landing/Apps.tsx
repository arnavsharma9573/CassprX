"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

/* ---------- CircularEffect (Neutral Colors) ---------- */
const CircularEffect = () => {
  const icons = [
    { src: "/blogger.svg", alt: "Blogger" },
    { src: "/instagram.svg", alt: "Instagram" },
    { src: "/threads.svg", alt: "Threads" },
    { src: "/facebook.svg", alt: "Facebook" },
    { src: "/twitter.svg", alt: "X" },
    { src: "/linkedin.svg", alt: "LinkedIn" },
  ];
  const radius = 240;

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="absolute lg:bottom-[-2rem] lg:right-[-2rem] -bottom-18 -right-16 w-80 h-80 flex items-center justify-center">
      <motion.div
        className="relative w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {hasMounted &&
          icons.map((icon, i) => {
            const angle = (i / icons.length) * 2 * Math.PI;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <motion.div
                key={icon.src}
                className="absolute bg-neutral-900 w-16 h-16 p-3 rounded-full shadow-lg"
                style={{
                  top: `calc(50% - 32px + ${y}px)`,
                  left: `calc(50% - 32px + ${x}px)`,
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                {/* Using <img> tag to load local SVGs */}
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  className="w-full h-full"
                  width={32}
                  height={32}
                />
              </motion.div>
            );
          })}
      </motion.div>
    </div>
  );
};

/* ---------- Landing Section ---------- */
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HighEndLandingSection() {
  return (
    <section className="relative isolate overflow-hidden text-white py-16">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:py-40">
        <motion.div
          initial="hidden"
          animate="show"
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* LEFT: text + CTA */}
          <div className="relative z-20">
            {/* --- CHANGE: Text color from blue to slate --- */}
            <p className="mb-3 text-md font-medium text-slate-400">
              Applications
            </p>
            <h1 className="text-[2.4rem] leading-tight md:text-[2.5rem] lg:text-[2.75rem]">
              <p className="block bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
                Say It.{" "}
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  See It Everywhere.
                </span>
              </p>
            </h1>
            <p className="mt-4 max-w-xl text-slate-300">
              Your ideas turn into engaging content across Instagram, Facebook,
              <span className="block">
                LinkedIn and every social platform you use to power your
                campaigns.
              </span>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* --- CHANGE: Primary button is now white/black, no blue shadow --- */}
              <Link href={"/auth/signup"}>
                <Button
                  variant="primary"
                  className="bg-white text-neutral-800 px-8 py-3 rounded-full hover:bg-neutral-100 cursor-pointer"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT: show CircularEffect */}
          <div className="hidden relative md:flex items-center justify-center">
            <div className="relative z-20 flex flex-col items-center justify-center">
              {/* --- CHANGE: Removed blue from central logo container --- */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-transparent">
                <Image
                  src="/Logo4.png"
                  alt="logo"
                  width={56}
                  height={56}
                  className="opacity-95"
                />
              </div>
              <div className="text-sm text-slate-100">  
                Connect with everything
              </div>
              <div className="mt-4 text-xl font-medium text-white">
                Seamless integrations • Real-time actions
              </div>
            </div>
            <div className="md:absolute top-[135%] left-[72%] -translate-x-1/2 -translate-y-1/2 z-30">
              <CircularEffect />
            </div>
            <motion.div
              className="absolute z-0 w-[700px] h-[700px] rounded-full blur-3xl"
              style={{
                left: "-6.85%",
                transform: "translate(-50%, -50%)",
                background: `
      radial-gradient(
        closest-side,
        #F2CD94 0%,      /* bright core */
        #E2BB7F 36%,   /* warm glow */
        #8D673D 45%,   /* darker edge */
        transparent 70%                 /* fade out */
      )
    `,
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.85, scale: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
