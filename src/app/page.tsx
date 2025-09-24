"use client";

import HighEndLandingSection from "@/components/landing/Apps";
import { GlowingEffectDemo } from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import HeroSection from "@/components/landing/HeroSection";
import ChatStreamMockupAuto from "@/components/landing/Mockup";
import ChatStreamMockup from "@/components/landing/Mockup";
import { Navbar } from "@/components/landing/Navbar";
import Strip from "@/components/landing/Strip";
import HowSuperCassprWorks from "@/components/landing/working";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard");
  };
  return (
    <main className="bg-[#020201]">
      {/* WRAPPER DIV */}
      <div className="relative">
        <Navbar />
        <div className="min-h-screen bg-[url('/BG-image.png')] bg-no-repeat bg-left-top">
          <HeroSection />
          <div
            className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-[#020201] to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
      {/* END WRAPPER DIV */}

      <HighEndLandingSection />
      <ChatStreamMockupAuto />
      {/* <HowSuperCassprWorks /> */}
      <GlowingEffectDemo />
      <Strip />
      <Footer />
    </main>
  );
}
