"use client";
import React from "react";
import { Check, Star, Zap, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
// --- NEW: Import motion and AnimatePresence ---
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function PricingCards() {
  const pricingPlans = {
    monthly: [
      {
        name: "Starter",
        price: "$9",
        period: "/month",
        description: "Perfect for individuals getting started",
        features: [
          "5 AI-powered content pieces per month",
          "Basic brand analysis",
          "Email support",
          "1 social media account",
          "Basic templates",
        ],
        popular: false,
        buttonText: "Get Started",
        icon: <Zap className="h-6 w-6" />,
      },
      {
        name: "Professional",
        price: "$29",
        period: "/month",
        description: "Ideal for growing businesses and teams",
        features: [
          "50 AI-powered content pieces per month",
          "Advanced brand analysis",
          "Priority support",
          "5 social media accounts",
          "Custom templates",
          "Analytics dashboard",
          "Content calendar",
        ],
        popular: true,
        buttonText: "Start Free Trial",
        icon: <Star className="h-6 w-6" />,
      },
      {
        name: "Enterprise",
        price: "$99",
        period: "/month",
        description: "Advanced features for large organizations",
        features: [
          "Unlimited AI-powered content",
          "Complete brand suite",
          "24/7 dedicated support",
          "Unlimited social accounts",
          "Custom integrations",
          "Advanced analytics",
          "Team collaboration",
          "API access",
        ],
        popular: false,
        buttonText: "Contact Sales",
        icon: <Shield className="h-6 w-6" />,
      },
    ],
    annually: [
      {
        name: "Starter",
        price: "$90",
        period: "/year",
        originalPrice: "$108",
        description: "Perfect for individuals getting started",
        features: [
          "5 AI-powered content pieces per month",
          "Basic brand analysis",
          "Email support",
          "1 social media account",
          "Basic templates",
        ],
        popular: false,
        buttonText: "Get Started",
        icon: <Zap className="h-6 w-6" />,
      },
      {
        name: "Professional",
        price: "$290",
        period: "/year",
        originalPrice: "$348",
        description: "Ideal for growing businesses and teams",
        features: [
          "50 AI-powered content pieces per month",
          "Advanced brand analysis",
          "Priority support",
          "5 social media accounts",
          "Custom templates",
          "Analytics dashboard",
          "Content calendar",
        ],
        popular: true,
        buttonText: "Start Free Trial",
        icon: <Star className="h-6 w-6" />,
      },
      {
        name: "Enterprise",
        price: "$990",
        period: "/year",
        originalPrice: "$1188",
        description: "Advanced features for large organizations",
        features: [
          "Unlimited AI-powered content",
          "Complete brand suite",
          "24/7 dedicated support",
          "Unlimited social accounts",
          "Custom integrations",
          "Advanced analytics",
          "Team collaboration",
          "API access",
        ],
        popular: false,
        buttonText: "Contact Sales",
        icon: <Shield className="h-6 w-6" />,
      },
    ],
  };

  // --- NEW: Animation variants for the card grid ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="monthly" className="w-full">
          <div className="flex justify-center mb-16">
            <TabsList className="bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm p-1">
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-[#eac565] data-[state=active]:text-black text-white px-6 py-2"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="annually"
                className="data-[state=active]:bg-[#eac565] data-[state=active]:text-black relative text-white px-6 py-2"
              >
                Annually
                {/* --- NEW: "Save 20%" Badge --- */}
                <div className="absolute -top-5 -right-4 bg-gradient-to-r from-yellow-400 to-[#eac565] text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                  Save 20%
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="monthly" key="monthly">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {pricingPlans.monthly.map((plan, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    className="flex"
                  >
                    <Card
                      className={`relative group overflow-hidden flex flex-col h-full w-full bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border transition-all duration-300
      ${
        plan.popular
          ? "border-[#eac565] shadow-2xl shadow-[#eac565]/10"
          : "border-white/20 hover:border-[#eac565]/50"
      }`}
                    >
                      {/* --- NEW: Refined top glow effect --- */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-24 bg-gradient-to-b from-white/10 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

                      {plan.popular && (
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#eac565] to-yellow-400 text-black text-sm font-medium py-2 text-center">
                          Most Popular
                        </div>
                      )}

                      <CardHeader
                        className={`relative z-10 ${
                          plan.popular ? "pt-14" : "pt-6"
                        }`}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="rounded-full bg-gradient-to-br from-[#eac565]/20 to-[#eac565]/10 p-3 text-[#eac565] border border-[#eac565]/30">
                            {plan.icon}
                          </div>
                          <div>
                            <CardTitle className="text-white text-xl">
                              {plan.name}
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              {plan.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-white">
                            {plan.price}
                          </span>
                          <span className="text-gray-400">{plan.period}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10 flex-grow">
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-start gap-3"
                            >
                              <Check className="h-5 w-5 text-[#eac565] mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="relative z-10 pt-6">
                        <Button
                          className={`w-full ${
                            plan.popular
                              ? "bg-[#eac565] hover:bg-[#eac565]/90 text-black shadow-lg shadow-[#eac565]/20"
                              : "bg-white/10 hover:bg-[#eac565] hover:text-black border border-white/20"
                          } transition-all duration-300`}
                          size="lg"
                        >
                          {plan.buttonText}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="annually" key="annually">
              {/* This structure is repeated for the annual plans to allow for animation */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {pricingPlans.annually.map((plan, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    className="flex"
                  >
                    <Card
                      className={`relative group overflow-hidden flex flex-col h-full w-full bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border transition-all duration-300
      ${
        plan.popular
          ? "border-[#eac565] shadow-2xl shadow-[#eac565]/10"
          : "border-white/20 hover:border-[#eac565]/50"
      }`}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-24 bg-gradient-to-b from-white/10 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

                      {plan.popular && (
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#eac565] to-yellow-400 text-black text-sm font-medium py-2 text-center">
                          Most Popular
                        </div>
                      )}

                      <CardHeader
                        className={`relative z-10 ${
                          plan.popular ? "pt-14" : "pt-6"
                        }`}
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="rounded-full bg-gradient-to-br from-[#eac565]/20 to-[#eac565]/10 p-3 text-[#eac565] border border-[#eac565]/30">
                            {plan.icon}
                          </div>
                          <div>
                            <CardTitle className="text-white text-xl">
                              {plan.name}
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              {plan.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-white">
                            {plan.price}
                          </span>
                          <span className="text-gray-400">{plan.period}</span>
                          {plan.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {plan.originalPrice}
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10 flex-grow">
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-start gap-3"
                            >
                              <Check className="h-5 w-5 text-[#eac565] mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="relative z-10 pt-6">
                        <Button
                          className={`w-full ${
                            plan.popular
                              ? "bg-[#eac565] hover:bg-[#eac565]/90 text-black shadow-lg shadow-[#eac565]/20"
                              : "bg-white/10 hover:bg-[#eac565] hover:text-black border border-white/20"
                          } transition-all duration-300`}
                          size="lg"
                        >
                          {plan.buttonText}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
