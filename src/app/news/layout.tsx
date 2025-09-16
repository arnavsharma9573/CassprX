import Footer from "@/components/landing/footer";
import { Navbar } from "@/components/landing/Navbar";

export default function NewsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-[#020201]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
