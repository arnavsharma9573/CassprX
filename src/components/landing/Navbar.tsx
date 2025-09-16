"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Pricing", href: "/pricing" },
    { name: "For Organization/API", href: "/organizations" },
    { name: "News & Updates", href: "/news" },
  ];

  return (
    <header>
      <div className="container mx-auto max-w-[90rem] flex h-16 items-center justify-between px-4">
        <div>
          <Link href="/">
            <Image src="/Logo2.png" alt="logo" width={165} height={52} />
          </Link>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-14">
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
        </nav>
      </div>
    </header>
  );
}
