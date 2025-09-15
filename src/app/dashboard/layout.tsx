import DashboardHeader from "@/components/dashboard/dashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      <div className="hidden lg:block w-[14%] md:w-[8%] lg:w-[12%] xl:w-[14%] md:p-1">
        <Sidebar />
      </div>
      <div className="flex-1 h-full flex flex-col overflow-hidden p-1">
        <DashboardHeader />
        {/* MAIN CONTENT */}
        {/* This is where the page-specific content (passed as 'children') will be rendered. */}
        <main className="flex-1 overflow-y-auto scrollbar-hide p-[1.12rem]">
          {children}
        </main>
      </div>
    </div>
  );
}
