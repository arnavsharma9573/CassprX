"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "../ui/button";
import { Heart, LogIn } from "lucide-react";
import WishList from "./WishlistModal";

export function Navbar() {
  const pathname = usePathname();
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const navItems = [
    { name: "Pricing", href: "/pricing" },
    { name: "For Organization/API", href: "/organizations" },
    { name: "News & Updates", href: "/news" },
  ];

  return (
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
          <WishList open={wishlistOpen} onOpenChange={setWishlistOpen} />
          <Link href={"/auth/signup"}>
            <Button
              variant="primary"
              className=" text-neutral-800 rounded-full cursor-pointer z-50"
            >
              <LogIn className=" h-5 w-5 text-white" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
