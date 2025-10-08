"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";
import { LogIn, Menu, X, ChevronDown } from "lucide-react";
import WishList from "./WishlistModal";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { name: "Pricing", href: "/pricing" },
    { name: "For Organization/API", href: "/organizations" },
    { name: "News & Updates", href: "/news" },
  ];

  const featureItems = [
    { title: "Content Creator Agent", href: "/agents/content-creator" },
    { title: "Market Research Agent", href: "/agents/market-research" },
    { title: "Persona Builder Agent", href: "/agents/persona-builder" },
    { title: "Auto-Posting Agent", href: "/agents/auto-posting" },
    { title: "Content Calendar Agent", href: "/agents/content-calendar" },
    { title: "Content Repurposer Agent", href: "/agents/content-repurposer" },
    { title: "Copywriter Agent", href: "/agents/copywriter" },
    {
      title: "Competitive Analysis Agent",
      href: "/agents/competitive-analysis",
    },
  ];

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="container mx-auto max-w-[90rem] flex h-16 items-center justify-between px-4 py-4">
          <div>
            <Link href="/">
              <div className="flex items-end space-x-1.5">
                <Image src="/Logo4.png" alt="logo" width={35} height={32} />
                <h1 className="text-white font-bold text-3xl">
                  casspr
                  <span className="font-thin tracking-wider">AIR</span>
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Pricing Link */}
            <Link
              href="/pricing"
              className={`transition-colors cursor-pointer ${
                pathname === "/pricing"
                  ? "text-[#e6c48a] font-semibold border-b-2 border-[#e6c48a] pb-1"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Pricing
            </Link>

            {/* Features Dropdown - Fixed version */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors">
                Features
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-80">
                  <div className="bg-black/30 backdrop-blur-lg border border-neutral-800 rounded-lg shadow-lg p-2 grid grid-cols-1 gap-1">
                    {featureItems.map((feature) => (
                      <Link
                        key={feature.title}
                        href={feature.href}
                        className="block p-1.5 rounded-md hover:bg-neutral-800/40 transition-colors"
                      >
                        <p className="text-white">{feature.title}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Other Nav Items */}
            {navItems.slice(1).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors cursor-pointer ${
                    isActive
                      ? "text-[#e6c48a] font-semibold border-b-2 border-[#e6c48a] pb-1"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            <Button
              onClick={() => setWishlistOpen(true)}
              variant="ghost"
              className="rounded-full bg-white"
            >
              Join Waiting List
            </Button>
            <Link href={"/auth/signup"}>
              <Button
                variant="primary"
                className="text-neutral-800 rounded-full cursor-pointer z-50"
              >
                <LogIn className="h-5 w-5 text-white" />
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(true)}
              variant="ghost"
              size="icon"
              className="hover:bg-neutral-700"
            >
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </header>

      {/* Wishlist Modal */}
      <WishList open={wishlistOpen} onOpenChange={setWishlistOpen} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg md:hidden"
          >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <Image src="/Logo2.png" alt="logo" width={165} height={52} />
              </Link>
              <Button
                onClick={() => setIsMenuOpen(false)}
                variant="ghost"
                size="icon"
              >
                <X className="h-6 w-6 text-white" />
              </Button>
            </div>
            <nav className="mt-16 flex flex-col items-center text-center space-y-8 px-4">
              {/* Mobile: Pricing Link */}
              <Link
                href="/pricing"
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-medium text-neutral-200 hover:text-white"
              >
                Pricing
              </Link>

              {/* Mobile: Features Accordion */}
              <div className="w-full">
                <button
                  onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                  className="w-full text-2xl font-medium text-neutral-200 hover:text-white flex items-center justify-center gap-2"
                >
                  Features
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      isFeaturesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isFeaturesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4 space-y-4"
                    >
                      {featureItems.map((feature) => (
                        <Link
                          key={feature.title}
                          href={feature.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-center"
                        >
                          <div className="text-lg font-medium text-neutral-300 hover:text-white">
                            {feature.title}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile: Other Links */}
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-medium text-neutral-200 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}

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
              <Link href={"/auth/login"} onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="primary"
                  className="text-neutral-300 rounded-full cursor-pointer z-50 px-8 py-6 text-xl"
                >
                  Login
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
