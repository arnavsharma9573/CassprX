"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Filter,
  Calendar,
  Eye,
  ChevronsUpDown,
  Loader2,
  Rocket,
} from "lucide-react";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";
import { Post, ViewMode } from "@/types/calender";
import CalendarView from "./CalenderView";
import { getPlatformName } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { RootState } from "@/store/store";
import { setActiveBrand } from "@/store/feature/brandSlice";
import { fetchCalendarForBrand } from "@/store/thunks/brandThunks";
import CalendarSkeleton from "./CalendarSkelton";

const ContentCalendar = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

  const dispatch = useAppDispatch();
  // ✅ FIX 1: Get the 'loading' status directly from the brand slice
  const {
    brands,
    activeBrandId,
    calendarLoading: isLoading,
  } = useAppSelector((state: RootState) => state.brand);

  const activeBrand = useMemo(
    () => brands.find((b) => b.id === activeBrandId),
    [brands, activeBrandId]
  );
  const campaignData = activeBrand?.calendarData?.calendar;

  useEffect(() => {
    if (activeBrand && !activeBrand.isDefault && !activeBrand.calendarData) {
      dispatch(fetchCalendarForBrand(activeBrand));
    }
  }, [activeBrand, dispatch]);

  const handleBrandSelect = (brandId: string) => {
    dispatch(setActiveBrand(brandId));
  };

  const filterOptions = useMemo<{
    platforms: string[];
    pillars: string[];
  }>(() => {
    if (!campaignData?.content_calendar) return { platforms: [], pillars: [] };

    const platforms = Array.from(
      new Set(
        campaignData.content_calendar.map((post: Post) =>
          getPlatformName(post.platform)
        )
      )
    ) as string[];
    const pillars = (campaignData.campaign_strategy.primary_pillars ||
      []) as string[];

    return { platforms, pillars };
  }, [campaignData]);

  const filteredPosts = useMemo(() => {
    if (!campaignData?.content_calendar) return [];
    if (selectedFilter === "all") return campaignData.content_calendar;
    return campaignData.content_calendar.filter((post: Post) => {
      const normalizedPlatform = getPlatformName(post.platform).toLowerCase();
      const filterLower = selectedFilter.toLowerCase();
      return (
        normalizedPlatform === filterLower ||
        post.content_pillar.toLowerCase() === filterLower
      );
    });
  }, [selectedFilter, campaignData?.content_calendar]);

  return (
    <motion.div
      className="min-h-screen text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.header
        className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="flex items-center gap-3 text-left p-2 rounded-lg hover:bg-neutral-800 transition-colors w-full md:w-auto"
              whileTap={{ scale: 0.98 }}
            >
              {activeBrand?.logoUrl ? (
                <Image
                  src={activeBrand.logoUrl}
                  alt={activeBrand.name}
                  width={32}
                  height={32}
                  className="rounded-md object-cover bg-white p-1"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-neutral-700 text-white font-bold rounded-md flex-shrink-0">
                  {activeBrand?.name?.[0]?.toUpperCase() || "B"}
                </div>
              )}
              <div className="flex-grow">
                <h1 className="text-lg font-bold text-white leading-tight">
                  {activeBrand?.name || "Select a Brand"}
                </h1>
                <p className="text-xs text-neutral-400">Content Calendar</p>
              </div>
              <ChevronsUpDown
                size={16}
                className="text-neutral-500 ml-2 flex-shrink-0"
              />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-neutral-900 border-neutral-700 text-white shadow-lg">
            <DropdownMenuLabel>Switch Brand</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-700" />
            {brands
              .filter((b) => !b.isDefault)
              .map((brand) => (
                <DropdownMenuItem
                  key={brand.id}
                  onSelect={() => handleBrandSelect(brand.id)}
                  className="flex items-center gap-3 cursor-pointer focus:bg-neutral-800"
                >
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      width={24}
                      height={24}
                      className="rounded-sm object-cover bg-white p-0.5"
                    />
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center bg-neutral-700 text-white font-bold rounded-sm text-xs flex-shrink-0">
                      {brand.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span>{brand.name}</span>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden">
            {["calendar", "list"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                  viewMode === mode
                    ? "bg-blue-600 text-white"
                    : "text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {mode === "calendar" ? (
                  <Calendar size={16} />
                ) : (
                  <Eye size={16} />
                )}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-neutral-400" />
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-[180px] bg-neutral-800 border-neutral-700 text-white focus:ring-1 focus:ring-blue-500 rounded-lg transition-all">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700 text-white shadow-md">
                <SelectItem value="all">All Content</SelectItem>
                <SelectGroup>
                  <SelectLabel>Platforms</SelectLabel>
                  {filterOptions.platforms.map((platform: string) => (
                    <SelectItem key={platform} value={platform.toLowerCase()}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Pillars</SelectLabel>
                  {filterOptions.pillars.map((pillar: string) => (
                    <SelectItem key={pillar} value={pillar.toLowerCase()}>
                      {pillar}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.header>

      {isLoading ? (
        <div className="animate-fade-in">
          <CalendarSkeleton />
        </div>
      ) : !campaignData ||
        !campaignData.content_calendar ||
        campaignData.content_calendar.length === 0 ? (
        <div className="text-center p-8 mt-16">
          <Rocket size={48} className="mx-auto text-amber-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Your Calendar is Ready for Liftoff!
          </h2>
          <p className="text-slate-400 mb-6">
            There is no calendar data for this brand yet. Let's create one.
          </p>
          <Link href="/dashboard/create-calendar">
            <button className="px-6 py-3 bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-white font-semibold rounded-lg transition-transform transform hover:scale-105 shadow-lg">
              Create First Calendar
            </button>
          </Link>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === "calendar" ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CalendarView
                posts={filteredPosts}
                timeline={campaignData.campaign_timeline}
                onPostSelect={setSelectedPost}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="grid grid-cols-1 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredPosts.map((post: Post, index: number) => (
                <motion.div
                  key={post.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PostCard post={post} onClick={setSelectedPost} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContentCalendar;
