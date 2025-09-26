"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";
import { Heart, LogIn, Menu, X } from "lucide-react";
import WishList from "./WishlistModal";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Pricing", href: "/pricing" },
    { name: "For Organization/API", href: "/organizations" },
    { name: "News & Updates", href: "/news" },
  ];

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="container mx-auto max-w-[90rem] flex h-16 items-center justify-between px-4 py-4">
          <div>
            <Link href="/">
              <Image src="/Logo2.png" alt="logo" width={165} height={52} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
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
                className=" text-neutral-800 rounded-full cursor-pointer z-50"
              >
                <LogIn className=" h-5 w-5 text-white" />
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
            <nav className="mt-16 flex flex-col items-center space-y-8">
              {navItems.map((item) => (
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
