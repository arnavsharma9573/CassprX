"use client";
import { ChevronDown, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Top nav links
  const topNav = [
    { name: "Pricing", href: "/pricing" },
    { name: "For Organizations", href: "/organizations" },
    { name: "News & Updates", href: "/news" },
  ];

  // Bottom legal links
  const bottomNav = [
    { name: "Email AI", href: "/email" },
    { name: "Who We Are", href: "/about" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const linkClass = (href: string) =>
    pathname === href
      ? "text-[#e6c48a] font-semibold border-b border-[#e6c48a] pb-[1px]"
      : "hover:text-white transition-colors";

  return (
    <footer className="bg-[#020201] text-gray-400 px-4 sm:px-8 md:px-16 py-16 md:py-22 border-t border-neutral-900/60">
      <div>
        {/* --- Top Section: Logo and Main Links --- */}
        <div className="mb-16">
          <div className="max-w-7xl mx-auto pb-16">
            <Image src="/Logo2.png" alt="logo" width={1420} height={800} />
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-lg max-w-7xl mx-auto">
            {topNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={linkClass(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* --- Bottom Section: Social, Legal, and Language --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs max-w-7xl mx-auto">
          {/* Left: Follow Button */}
          <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full transition-colors order-1 md:order-1">
            <span>Follow us on</span>
            <X className="h-4 w-4" />
          </button>

          {/* Center: Legal Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 order-3 md:order-2 w-full md:w-auto justify-start md:justify-center">
            {bottomNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={linkClass(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Language Selector */}
          <button className="flex items-center gap-1 hover:text-white transition-colors order-2 md:order-3 self-end md:self-center">
            <span>English (en)</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
