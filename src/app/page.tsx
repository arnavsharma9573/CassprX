"use client";

import HighEndLandingSection from "@/components/landing/Apps";
import { GlowingEffectDemo } from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import HeroSection from "@/components/landing/HeroSection";
import ChatStreamMockup from "@/components/landing/Mockup";
import { Navbar } from "@/components/landing/Navbar";
import HowSuperCassprWorks from "@/components/landing/working";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard");
  };
  return (
    <main className="bg-[#020201]">

      {/* --- HERO SECTION WRAPPER --- */}
      <div className="relative min-h-screen bg-[url('/Bg-image.png')] bg-no-repeat bg-left-top">
        <Navbar />
        <HeroSection />

        {/* 👇 THIS IS THE FADING OVERLAY 👇 */}
        <div 
          className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#020201] to-transparent pointer-events-none"
          aria-hidden="true" 
        />
      </div>

      {/* --- OTHER SECTIONS --- */}
      <HighEndLandingSection />
      <HowSuperCassprWorks/>
      <GlowingEffectDemo />
      <Footer/>
      {/* <ChatStreamMockup /> */}
      
    </main>
  );
}
