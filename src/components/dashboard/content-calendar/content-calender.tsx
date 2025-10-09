"use client";
import React, { useState, useMemo } from "react";
import { Filter, Calendar, Eye } from "lucide-react";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";
import { CampaignData, Post, ViewMode } from "@/types/calender";
import { pillarColors } from "@/utils/constants";
import CalendarView from "./CalenderView";
import { getPlatformName } from "@/lib/helper";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContentCalendarProps {
  campaignData: CampaignData;
  brandName: string | undefined;
  brandLogo: string | undefined;
}

const ContentCalendar = ({
  campaignData,
  brandName,
  brandLogo,
}: ContentCalendarProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

  const filteredPosts = useMemo(() => {
    if (selectedFilter === "all") return campaignData.content_calendar;
    return campaignData.content_calendar.filter((post) => {
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
      className="min-h-screen p-4 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              className="w-12 h-12 bg-white rounded-lg flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Image
                src={brandLogo || "B"}
                alt={brandName || "Brand logo"}
                width={32}
                height={32}
                className="rounded-md object-cover"
              />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {brandName} Content Calendar
              </h1>
              <p className="text-gray-400">
                {campaignData.campaign_strategy.creative_direction}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              {
                value: campaignData.campaign_timeline.total_posts,
                label: "Total Posts",
                color: "blue",
              },
              {
                value: campaignData.campaign_timeline.duration_weeks,
                label: "Weeks",
                color: "green",
              },
              {
                value: campaignData.campaign_strategy.primary_pillars.length,
                label: "Content Pillars",
                color: "purple",
              },
              { value: 3, label: "Platforms", color: "orange" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`bg-${item.color}-900/30 p-3 rounded-lg border border-${item.color}-500/30`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <div className={`text-2xl font-bold text-${item.color}-400`}>
                  {item.value}
                </div>
                <div className={`text-sm text-${item.color}-400`}>
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pillars */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {campaignData.campaign_strategy.primary_pillars.map((pillar) => (
              <span
                key={pillar}
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  pillarColors[pillar] ||
                  "bg-neutral-800/50 text-gray-300 border-gray-500/50"
                }`}
              >
                {pillar}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="mb-6 flex flex-wrap gap-4 items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex bg-neutral-800 rounded-lg border border-gray-600 overflow-hidden">
          {["calendar", "list"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as ViewMode)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                viewMode === mode
                  ? "bg-blue-500 text-white scale-105"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {mode === "calendar" ? <Calendar size={16} /> : <Eye size={16} />}
              {mode === "calendar" ? "Calendar View" : "List View"}
            </button>
          ))}
        </div>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Filter size={18} className="text-gray-400" />
          <div className="flex items-center gap-2">
            <Label
              htmlFor="filter"
              className="text-gray-300 text-sm font-medium"
            >
              Filter
            </Label>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger
                id="filter"
                className="w-[180px] bg-neutral-900 border border-neutral-700 text-white focus:ring-1 focus:ring-blue-500 rounded-lg transition-all"
              >
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border border-neutral-700 text-white shadow-md">
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </motion.div>

      {/* Content Transition */}
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
            className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredPosts.map((post, index) => (
              <motion.div
                key={index}
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

      {/* Modal */}
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
