"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function GlowingEffectDemo() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 mt-10 space-y-18 ">
      {/* Section Heading */}
      <div className="text-center">
        <h2 className="text-3xl md:text-6xl font-bold text-white tracking-tight">
          Explore Powerful{" "}
          <span className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
            {" "}
            Features
          </span>
        </h2>
        <p className="mt-2 text-gray-400 text-sm md:text-base">
          Everything you need to build, automate, and scale — beautifully
          designed.
        </p>
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-6 xl:max-h-[34rem] xl:grid-rows-2">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={
            <Box className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          }
          title="Do things the right way"
          description="A clean, structured approach that helps your workflow scale seamlessly."
        />

        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={
            <Settings className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          }
          title="The best AI code editor"
          description="Write, debug, and ship faster with intelligent AI-driven assistance."
        />

        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={
            <Lock className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          }
          title="Enterprise-grade security"
          description="Your data stays private, encrypted, and secure — built for trust."
        />

        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={
            <Sparkles className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          }
          title="Smarter automation"
          description="Let AI handle repetitive work so you can focus on what matters."
        />

        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={
            <Search className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
          }
          title="Advanced search"
          description="Find exactly what you need across projects with lightning speed."
        />
      </ul>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });

  return (
    <motion.li
      ref={ref}
      className={`min-h-[14rem] list-none ${area}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative h-full rounded-2xl border border-neutral-800 bg-[#020201b0] backdrop-blur-sm p-2 md:rounded-3xl md:p-3 transition-transform duration-200 hover:scale-[1.02] group">
        <GlowingEffect
          spread={50}
          glow={true}
          disabled={false}
          proximity={72}
          inactiveZone={0.02}
        />
        <div className="border border-neutral-800 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 shadow-[0px_0px_20px_rgba(0,0,0,0.4)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-700 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-sans text-xl md:text-2xl font-semibold text-white tracking-tight">
                {title}
              </h3>
              <p className="font-sans text-sm md:text-base text-gray-400">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute -left-8 -right-5 -bottom-28 w-[420px] h-[420px] blur-3xl rounded-full opacity-10"
            style={{
              background: "linear-gradient(135deg, #CEA368, #CEA368)",
            }}
          />
        </div> */}
      </div>
    </motion.li>
  );
};
