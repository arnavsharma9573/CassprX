import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex bg-[#020201]">
      <div className="hidden lg:block w-[14%] md:w-[8%] lg:w-[12%] xl:w-[14%]">
        <Sidebar />
      </div>
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        {/* <DashboardHeader /> */}
        <main className="flex-1 overflow-y-auto" style={{scrollbarWidth:"none"}}>
          {children}
        </main>
      </div>
    </div>
  );
}
