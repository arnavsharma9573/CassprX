"use client"
import React from "react";
import { Shield, Smartphone, Server, Zap, Globe, Users } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function OptionalServices() {
  const addOns = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multi-Language Support",
      description:
        "Expand your reach with content generation in over 50 languages worldwide.",
      price: "$5.99",
      period: "/ month",
      buttonText: "Get Started",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description:
        "Advanced team features including shared workspaces and real-time collaboration tools.",
      price: "$6.99",
      period: "/ month",
      buttonText: "Get Started",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Priority Processing",
      description:
        "Get your content generated and processed with lightning-fast priority queue access.",
      price: "$3.50",
      period: "/ month",
      buttonText: "Get Started",
    },
  ];

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
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col mt-5 justify-center items-center text-center py-20 px-4">
      <motion.div
        className="text-white flex flex-col space-y-2 mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <motion.p
          className="text-xl text-[#eac565]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          Optional Services
        </motion.p>
        <motion.h2
          className="text-6xl font-medium"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Add-Ons
        </motion.h2>
        <motion.p
          className="block text-lg font-light text-gray-300 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Get More out with Casspr with optional add-ons. Available on all
          plans.{" "}
          <span className="block mt-2">
            Head to the settings page to configure your add-ons.
          </span>
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full justify-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {addOns.map((addon, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover="hover"
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl shadow-[#eac565]/10 hover:shadow-[#eac565]/20 transition-all duration-500 hover:scale-[1.02] hover:border-[#eac565]/40"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-70"></div>

            {/* Top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

            {/* Side highlight */}
            <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/40 via-transparent to-transparent"></div>

            {/* Animated shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{
                x: "100%",
                transition: { duration: 0.8, ease: "easeInOut" },
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 transform"></div>
            </motion.div>

            <div className="relative z-10 p-8">
              {/* Icon */}
              <motion.div
                className="mb-6"
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              >
                <div className="rounded-full bg-gradient-to-br from-[#eac565]/20 to-[#eac565]/40 p-4 w-fit mx-auto border border-[#eac565]/30 shadow-lg shadow-[#eac565]/20">
                  <motion.div
                    className="text-[#eac565]"
                    whileHover={{ rotate: 10, transition: { duration: 0.3 } }}
                  >
                    {addon.icon}
                  </motion.div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="mb-8 text-center">
                <motion.h3
                  className="text-xl font-semibold text-white mb-3"
                  whileHover={{
                    color: "#eac565",
                    transition: { duration: 0.2 },
                  }}
                >
                  {addon.title}
                </motion.h3>
                <motion.p
                  className="text-sm text-gray-300 leading-relaxed mb-6"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1, transition: { duration: 0.2 } }}
                >
                  {addon.description}
                </motion.p>

                {/* Pricing */}
                <motion.div
                  className="flex items-baseline justify-center gap-1 mb-6"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <span className="text-4xl font-bold text-white">
                    {addon.price}
                  </span>
                  <span className="text-gray-400 text-sm">{addon.period}</span>
                </motion.div>
              </div>

              {/* Button */}
              <motion.button
                className="w-full bg-gradient-to-r from-[#eac565]/10 to-[#eac565]/20 hover:from-[#eac565] hover:to-[#eac565]/90 text-[#eac565] hover:text-black border border-[#eac565]/30 hover:border-[#eac565] rounded-xl py-3 px-6 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#eac565]/30"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                {addon.buttonText}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.p
          className="text-gray-400 text-sm mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          viewport={{ once: true }}
        >
          Need help choosing the right add-ons for your business?
        </motion.p>
        <motion.button
          className="bg-[#eac565] hover:bg-[#eac565]/90 text-black px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#eac565]/30"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Our Team
        </motion.button>
      </motion.div>
    </div>
  );
}
