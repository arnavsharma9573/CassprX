import React from "react";
import { EyeOff, Phone, Wallet } from "lucide-react";
import FadingSentences from "../landing/FadingSentences";
import PricingCards from "./PricingCards";
import { Navbar } from "../landing/Navbar";

export default function HeroSectionPricing() {
  return (
    <div className="flex flex-col bg-black min-h-screen">
      <div className="text-white flex mx-auto flex-col mt-19 items-center justify-center text-center max-w-7xl px-4">
        <div className="inline-flex items-center px-4 py-2 border border-neutral-700 rounded-full mb-8">
          <Wallet className="w-4 h-4 mr-2 text-[#eac565]" />
          <span className="text-sm text-neutral-300">
            Pricing
          </span>
        </div>
        <div className="text-4xl md:text-5xl font-medium mb-6">
          <p>Security. Privacy. Freedom </p>
          <p>for Everyone</p>
        </div>
        <div className="text-xl mt-2 mb-8">
          <p className="text-lg font-light text-gray-300">
            Select a plan to access your favorite content with lightning speed
          </p>
        </div>

        <div className="flex mt-5 space-x-12 mb-12">
          <div className="flex space-x-2 items-center text-gray-300">
            <EyeOff size={20} className="text-[#eac565]" />
            <span>No logs Policy</span>
          </div>
          <div className="flex space-x-2 items-center text-gray-300">
            <Phone size={20} className="text-[#eac565]" />
            <span>24/7 Live Support</span>
          </div>
        </div>
        <div>
          <FadingSentences />
        </div>
        {/* Pricing Cards Section with Fading Background */}
        <section className="relative w-full min-h-screen">
          {/* Gradient overlay to fade the ripple effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-10" />
          {/* Pricing content */}
          <div className="relative z-20">
            <PricingCards />
          </div>
        </section>
      </div>
    </div>
  );
}
