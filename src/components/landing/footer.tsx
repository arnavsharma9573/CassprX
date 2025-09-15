import { AtSign, ChevronDown, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#020201] text-gray-400 px-4 sm:px-8 md:px-12 py-16 border-t-1 border-neutral-900/60">
      <div className="">
        {/* --- Top Section: Logo and Main Links --- */}
        <div className="mb-12">
          <div className="max-w-5xl mx-auto mb-8 pb-16">
            <Image src="Logo.svg" alt="logo" width={1000} height={950} />
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-lg">
            <Link
              href="/pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/organizations"
              className="hover:text-white transition-colors"
            >
              For Organizations
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors">
              News & Updates
            </Link>
          </nav>
        </div>
        {/* --- Bottom Section: Social, Legal, and Language --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs">
          {/* Left: Follow Button */}
          <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full transition-colors order-1 md:order-1">
            <span>Follow us on</span>
            <Twitter className="h-4 w-4" />
          </button>

          {/* Center: Legal Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 order-3 md:order-2 w-full md:w-auto justify-start md:justify-center">
            <Link href="/email" className="hover:text-white transition-colors">
              Email AI
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Who We Are
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
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