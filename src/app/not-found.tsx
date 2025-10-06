"use client";
import Link from "next/link";
import { Hammer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Building() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[#0D0D0D] text-white">
      <div className="max-w-md w-full bg-[#1A1A1A] p-10 rounded-2xl shadow-lg border border-[#E6A550]/30">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6A550]/10 mb-6">
          <Hammer className="h-9 w-9 text-[#E6A550]" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#E6A550] sm:text-5xl">
          We’re Building Something Great
        </h1>
        <p className="mt-4 text-base text-gray-400">
          Our team is working hard to bring this page to life.  
          Check back soon for updates!
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button
              variant="outline"
              className="border-[#E6A550] text-[#E6A550] hover:bg-[#E6A550] hover:text-black transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
