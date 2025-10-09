"use client";
import ContentCalendar from "@/components/dashboard/content-calendar/content-calender";
import { useAppSelector } from "@/hooks/redux-hooks";
import { RootState } from "@/store/store";
import { Link, Rocket } from "lucide-react";

export default function ContentCalendarPage() {
  const { brands, activeBrandId } = useAppSelector(
    (state: RootState) => state.brand
  );

  const activeBrand = brands.find((brand) => brand.id === activeBrandId);
  const activeCampaignData = activeBrand?.calendarData;

  // console.log(activeBrand?.logoUrl, "active brand");

  if (activeBrandId && !activeCampaignData) {
    return (
      <div className="text-center p-8 mt-16">
        <Rocket size={48} className="mx-auto text-amber-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Your Calendar is Ready for Liftoff!
        </h2>
        <p className="text-slate-400 mb-6">
          This brand doesn't have a content calendar yet. Let's create one.
        </p>
        <Link href="/create-calendar">
          <button className="px-6 py-3 bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-white font-semibold rounded-lg transition-transform transform hover:scale-105 shadow-lg">
            Create First Calendar
          </button>
        </Link>
      </div>
    );
  }

  if (!activeCampaignData) {
    return <div className="p-4 text-white">Loading Content Calendar...</div>;
  }

  return (
    <ContentCalendar
      campaignData={activeCampaignData.calendar}
      brandName={activeBrand?.brandKits?.[0]?.name}
      brandLogo={activeBrand?.logoUrl}
    />
  );
}
