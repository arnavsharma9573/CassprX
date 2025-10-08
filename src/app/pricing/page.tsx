// pages/pricing.jsx or your main pricing page
import { Navbar } from "@/components/landing/Navbar";
import HeroSectionPricing from "@/components/pricing/HeroSection";
import OptionalServices from "@/components/pricing/OptionalServices";
import PricingCards from "@/components/pricing/PricingCards";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export default function PricingPage() {
  return (
    <>
      <section>
        <Navbar />
      </section>
      {/* Hero Section with Background Ripple */}
      <section className="relative w-full min-h-screen overflow-hidden">
        <BackgroundRippleEffect rows={15} />
        <HeroSectionPricing />
      </section>
      {/* <OptionalServices /> */}
    </>
  );
}
