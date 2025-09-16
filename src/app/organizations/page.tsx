import { Navbar } from "@/components/landing/Navbar";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import React from "react";

export default function OrganizationPage() {
  return (
    <>
      <section>
        <Navbar />
      </section>
      {/* Hero Section with Background Ripple */}
      <section className="relative w-full min-h-screen overflow-hidden">
        <BackgroundRippleEffect rows={15} />
      </section>
    </>
  );
}
