"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { Brand } from "@/store/feature/brandSlice";

interface BrandSwitcherProps {
  brands: Brand[];
  activeBrandId: string | null;
  onBrandSelect: (brandId: string) => void;
}

export function BrandSwitcher({
  brands,
  activeBrandId,
  onBrandSelect,
}: BrandSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Find the active brand to display in the trigger
  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  // Effect to handle clicks outside the component to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (brandId: string) => {
    onBrandSelect(brandId);
    setIsOpen(false); // Close the dropdown on selection
  };

  return (
    <div ref={switcherRef} className="relative mb-3">
      {/* Select Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/60 backdrop-blur-xl shadow-lg cursor-pointer hover:border-neutral-600/80 transition-all duration-300 group"
      >
        {/* Active Brand Icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-800/70 group-hover:bg-neutral-700/70 transition-colors shadow-md flex-shrink-0">
          {activeBrand.isDefault ? (
            <Zap className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]" />
          ) : activeBrand.logoUrl ? (
            <Image
              src={activeBrand.logoUrl}
              alt={activeBrand.name}
              width={32}
              height={32}
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <span className="text-xs font-semibold text-white">
              {activeBrand.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors truncate">
          {activeBrand.name}
        </span>

        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-neutral-400 group-hover:text-neutral-300 ml-auto transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-300 ml-auto transition-transform" />
        )}
      </button>

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full mb-2 left-0 w-full min-w-[240px] rounded-xl bg-neutral-900/95 border border-neutral-700/60 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-neutral-800/60">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Select Brand
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <button
                    onClick={() => handleSelect(brand.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                      activeBrandId === brand.id
                        ? "bg-amber-500/10"
                        : "hover:bg-neutral-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-800 flex-shrink-0">
                      {brand.isDefault ? (
                        <Zap className="w-4 h-4 text-amber-400" />
                      ) : brand.logoUrl ? (
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          width={32}
                          height={32}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-white">
                          {brand.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-white/90 text-left flex-1 truncate">
                      {brand.name}
                    </p>
                    {activeBrandId === brand.id && (
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
