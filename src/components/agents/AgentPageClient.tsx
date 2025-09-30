"use client";

import { motion } from "framer-motion";
import ChatMockup from "@/components/agents/ChatMockup";
import { Agent } from "@/lib/agent-data";
import { Button } from "../ui/button";
import { useState } from "react";
import WishList from "../landing/WishlistModal";

interface AgentPageClientProps {
  agent: Agent;
}

export default function AgentPageClient({ agent }: AgentPageClientProps) {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] bg-[#eac565]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[60rem] h-[60rem] bg-[#eac565]/10 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center min-h-screen py-32 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-block px-4 py-2 bg-[#eac565]/10 border border-[#eac565]/20 rounded-full mb-6">
              <span className="text-[#eac565] text-sm font-medium">
                {agent.tagline}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 mb-6">
              {agent.title}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed mb-8">
              {agent.description}
            </p>
            {/* <p className="text-lg text-neutral-400 leading-relaxed">
              {agent.longDescription}
            </p> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ChatMockup
              messages={agent.chatMockupData}
              agentName={agent.title}
            />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Key Features
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Powerful capabilities designed to transform your workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agent.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 hover:border-[#eac565]/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Real-World Applications
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              See how this agent solves real business challenges
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {agent.useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 hover:border-[#eac565]/50 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-neutral-300 mb-4">{useCase.description}</p>
                <div className="bg-neutral-800/50 rounded-lg p-4 border-l-4 border-[#eac565]">
                  <p className="text-sm text-neutral-400 italic">
                    &quot;{useCase.example}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Capabilities
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Expertise across multiple dimensions
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 md:p-12">
            <div className="space-y-8">
              {agent.capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold text-white">
                      {capability.name}
                    </span>
                    <span className="text-[#C7864B] font-bold">
                      {capability.level}/5
                    </span>
                  </div>
                  <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${(capability.level / 5) * 100}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#EBA86D] via-[#C7864B] to-[#BF7E43] rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose This Agent?
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Tangible benefits that drive real results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {agent.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start gap-4 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:border-[#eac565]/50 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#eac565]/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#eac565]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-lg text-neutral-200">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#eac565]/20 backdrop-blur-sm border border-[#eac565]/30 rounded-3xl p-12 md:p-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using {agent.title} to transform
              their workflow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setWishlistOpen(true);
                  setIsMenuOpen(false);
                }}
                variant="ghost"
                className="rounded-full bg-white text-xl px-8 py-6"
              >
                Join Waiting List
              </Button>
            </div>
          </motion.div>
          <WishList open={wishlistOpen} onOpenChange={setWishlistOpen} />
        </section>
      </div>
    </div>
  );
}
