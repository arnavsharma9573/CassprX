"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Type,
  Image as ImageIcon,
  MessageSquare,
  X,
  Copy,
  Check,
  Download,
} from "lucide-react";
import Image from "next/image";
import { Brand, BrandKit } from "@/store/feature/brandSlice";

// ========== 1. TYPE DEFINITIONS ==========
interface Color {
  hex: string;
  name: string;
  description?: string;
}

// ========== 2. ENHANCED DRAWER SUB-COMPONENTS ==========

const Section = ({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`py-6 border-b border-slate-700/30 ${className}`}>
    <div className="flex items-center gap-3 px-6 mb-4">
      <div className="p-2 rounded-lg bg-gradient-to-br from-[#eac565]/10 to-[#eac565]/5 border border-[#eac565]/20">
        <Icon className="w-4 h-4 text-[#eac565]" />
      </div>
      <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text">
        {title}
      </h3>
    </div>
    <div className="px-6 space-y-4">{children}</div>
  </div>
);

const ColorSwatch = ({ color }: { color: Color }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(color.hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy color code");
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 group">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className="w-12 h-12 rounded-xl border-2 border-slate-600/50 shadow-lg transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: color.hex }}
          />
          <div className="absolute inset-0 rounded-xl border border-white/10" />
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{color.name}</p>
          <p className="text-sm text-slate-400 font-mono">
            {color.hex.toUpperCase()}
          </p>
          {color.description && (
            <p className="text-xs text-slate-500 mt-1">{color.description}</p>
          )}
        </div>
      </div>
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-200 group/tooltip relative"
        title="Copy color code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-slate-400 group-hover:text-white" />
        )}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none">
          Copy HEX
        </div>
      </button>
    </div>
  );
};

const AssetCard = ({
  title,
  src,
  alt,
}: {
  title: string;
  src: string;
  alt: string;
}) => (
  <div className="group">
    <p className="text-sm text-slate-400 mb-3 font-medium">{title}</p>
    <div className="relative p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/30 rounded-2xl border border-slate-700/30 hover:border-[#eac565]/30 transition-all duration-300">
      <div className="flex justify-center">
        <Image
          src={src}
          alt={alt}
          width={120}
          height={120}
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <button className="absolute top-3 right-3 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
        <Download className="w-3 h-3 text-slate-300" />
      </button>
    </div>
  </div>
);

const TypographyCard = ({
  fontFamily,
  label,
}: {
  fontFamily: string;
  label: string;
}) => (
  <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/20 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200">
    <p className="text-sm text-slate-400 mb-3 font-medium">{label}</p>
    <div
      className="text-2xl font-light text-white p-3 rounded-lg bg-slate-800/20 border border-slate-700/20"
      style={{ fontFamily }}
    >
      Aa Bb Cc
    </div>
    <p className="text-xs text-slate-500 mt-2 font-mono">{fontFamily}</p>
  </div>
);

// ========== 3. ENHANCED BRAND KIT DRAWER COMPONENT ==========
interface BrandKitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  kit: BrandKit | undefined;
}

const BrandKitDrawer = ({ isOpen, onClose, kit }: BrandKitDrawerProps) => {
  if (!kit) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Enhanced Drawer Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              opacity: { duration: 0.2 },
            }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-black backdrop-blur-xl z-50 flex flex-col shadow-2xl border-l border-slate-700/30"
          >
            {/* Enhanced Header */}
            <div className="relative p-6 border-b-2 border-slate-700/30 flex-shrink-0">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#eac565]/50 to-transparent" />
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    Brand Kit
                  </h2>
                  <p className="text-lg font-semibold bg-gradient-to-r from-[#eac565] to-yellow-400 bg-clip-text text-transparent">
                    {kit.name}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 group"
                >
                  <X
                    size={20}
                    className="text-slate-400 group-hover:text-white transition-colors"
                  />
                </button>
              </div>
            </div>

            {/* Enhanced Content */}
            <div className="overflow-y-auto flex-grow custom-scrollbar">
              {/* Visual Identity */}
              <Section title="Color Palette" icon={Palette}>
                <div className="space-y-3">
                  {kit.kitData.visual_identity?.color_palette?.primary_colors?.map(
                    (color) => (
                      <ColorSwatch key={color.hex} color={color} />
                    )
                  )}
                </div>
              </Section>

              <Section title="Typography" icon={Type}>
                <TypographyCard
                  fontFamily={
                    kit.kitData.visual_identity?.typography?.primary_font ||
                    "sans-serif"
                  }
                  label="Primary Font"
                />
              </Section>

              {/* Assets */}
              <Section title="Brand Assets" icon={ImageIcon}>
                <div className="space-y-6">
                  {kit.kitData.assets.logo_path && (
                    <AssetCard
                      title="Logo"
                      src={kit.kitData.assets.logo_path}
                      alt="Brand Logo"
                    />
                  )}
                  {kit.kitData.assets.mascot_path && (
                    <AssetCard
                      title="Mascot"
                      src={kit.kitData.assets.mascot_path}
                      alt="Brand Mascot"
                    />
                  )}
                  {kit.kitData.assets.additional_images && (
                    <AssetCard
                      title="Additional Brand Images"
                      src={kit.kitData.assets.additional_images[0]}
                      alt="Brand Mascot"
                    />
                  )}
                </div>
              </Section>

              {/* Messaging */}
              <Section
                title="Tone & Messaging"
                icon={MessageSquare}
                className="border-b-0"
              >
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/20 border border-slate-700/30">
                  <p className="text-sm text-slate-400 mb-3 font-medium">
                    Value Proposition
                  </p>
                  <div className="relative">
                    <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-[#eac565] to-yellow-400 rounded-full" />
                    <p className="text-white text-sm leading-relaxed pl-4 italic">
                      "
                      {kit.kitData.tone_and_messaging?.messaging
                        ?.value_proposition || "No value proposition defined"}
                      "
                    </p>
                  </div>
                </div>
              </Section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BrandKitDrawer;
