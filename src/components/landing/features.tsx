"use client";

import Image from "next/image";
import { CardStackDemo } from "./CardStack";
import { motion, Variants } from "framer-motion";

export function GlowingEffectDemo() {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-24 mt-10 space-y-18"
      id="agent-directory"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      
      {/* Section Heading */}
      <motion.div className="text-center" variants={itemVariants}>
        <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
          Explore Powerful{" "}
          <span className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
            {" "}
            Features
          </span>
        </h2>
        <motion.p
          className="mt-2 text-gray-300 text-sm md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Everything you need to build, automate, and scale — beautifully
          designed.
        </motion.p>
        
      </motion.div>

      {/* Grid */}
      <motion.div
        className="w-full flex flex-col lg:flex-row gap-6 text-white"
        variants={containerVariants}
      >
        <div className="w-full lg:flex-[0.4] flex flex-col gap-6">
          <motion.div
            className="lg:flex-[0.4] relative w-full border flex flex-col items-center justify-center gap-5 p-8 rounded-3xl"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.p
              className="text-white text-3xl text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              From ideas to publishing—simplified, automated, all under one
              roof.
            </motion.p>
          </motion.div>

          <motion.div
            className="lg:flex-[0.6] relative w-full border flex flex-col md:flex-row lg:flex-col items-center justify-center gap-5 p-8 rounded-3xl"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="w-full lg:flex-[0.5] flex items-center justify-center p-4 gap-4 flex-col text-white">
              <motion.p
                className="text-2xl font-medium text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
              >
                The powerfull{" "}
                <span className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
                  Agents
                </span>{" "}
                at work
              </motion.p>
              <motion.p
                className="text-md text-neutral-300 text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                These agents don't just follow scripts - they adapt, learn
                patterns, and evolve your workflows over time.
              </motion.p>
            </div>
            <motion.div
              className="w-full lg:flex-[0.5]"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <CardStackDemo />
            </motion.div>
          </motion.div>
        </div>

        <div className="w-full lg:flex-[0.6] flex flex-col gap-6">
          <motion.div
            className="w-full h-full lg:flex-[0.6] flex flex-col lg:flex-row gap-6"
            variants={containerVariants}
          >
            <motion.div
              className="lg:flex-[0.5] w-full flex flex-col md:flex-row lg:flex-col border rounded-3xl overflow-hidden shadow-2xl"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="w-full lg:flex-[0.5]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  alt="background-agents"
                  loading="lazy"
                  width="395"
                  height="320"
                  decoding="async"
                  data-nimg="1"
                  src="/finalcalender.png"
                  style={{ color: "transparent" }}
                  className="w-full h-full object-cover opacity-70"
                />
              </motion.div>
              <motion.div
                className="w-full lg:flex-[0.5] flex items-center justify-center p-8 gap-4 flex-col text-center text-white "
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-2xl font-medium">Smarter Trend Tracking</p>
                <p className="text-md text-gray-300">
                  While others track trends and update spreadsheets by hand,
                  your agents are already steps ahead.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="lg:flex-[0.5] w-full flex flex-col md:flex-row lg:flex-col bg-background border-1 rounded-3xl"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="w-full lg:flex-[0.5]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  alt="background-agents"
                  loading="lazy"
                  width="395"
                  height="320"
                  decoding="async"
                  data-nimg="1"
                  src="/final-removebg-preview.png"
                  style={{ color: "transparent", opacity: 20 }}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="w-full lg:flex-[0.5] flex items-center justify-center p-8 gap-4 flex-col"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-2xl font-medium bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent">
                  Apps
                </p>
                <p className="text-md text-neutral-300 text-left block">
                  Transform ideas into powerful content fueling campaigns on
                  every platform.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:flex-[0.6] w-full flex flex-col md:flex-row border rounded-3xl overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              className="w-full lg:flex-[0.5] flex items-center justify-center p-8 gap-4 flex-col text-center text-white bg-gradient-to-r from-neutral-950 to-[#141414]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl font-medium">
                Automate Your Social Media Presence
              </p>
              <p className="text-md text-gray-300">
                Streamline your marketing by setting up an autoposting schedule
                that consistently shares content optimized for your target
                keywords.
              </p>
            </motion.div>
            <motion.div
              className="w-full lg:flex-[0.5]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                alt="background-agents"
                loading="lazy"
                width="385"
                height="300"
                decoding="async"
                data-nimg="1"
                src="/6.png"
                style={{ color: "transparent" }}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
