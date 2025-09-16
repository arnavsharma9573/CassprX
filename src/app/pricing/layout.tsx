import Footer from "@/components/landing/footer";
import { Navbar } from "@/components/landing/Navbar";

export default function PricingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-[#020201]">
      {children}
      <Footer />
    </div>
  );
}
