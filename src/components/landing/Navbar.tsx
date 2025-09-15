"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  // Navigation items
  const navItems = [
    { name: "Pricing", href: "/" },
    { name: "For Organization/API", href: "/" },
    { name: "News & Updates", href: "/" },
  ];

  return (
    <header className="">
      <div className="container mx-auto max-w-[90rem] flex h-16 items-center justify-between px-4">
        <div></div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-14">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-neutral-300">
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
