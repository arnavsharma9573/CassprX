import React, { useState, useMemo } from "react";
import { Filter, Calendar, Eye } from "lucide-react";
import PostCard from "./PostCard";
import PostDetailModal from "./PostDetailModal";
import { CampaignData, Post, ViewMode } from "@/types/calender";
import { pillarColors } from "@/utils/constants";
import CalendarView from "./CalenderView";

interface ContentCalendarProps {
  campaignData: CampaignData;
}

const ContentCalendar = ({ campaignData }: ContentCalendarProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  console.log(campaignData,"campaign data")
  const filteredPosts = useMemo(() => {
    if (selectedFilter === "all") return campaignData.content_calendar;
    return campaignData.content_calendar.filter(
      (post) =>
        post.platform.toLowerCase() === selectedFilter.toLowerCase() ||
        post.content_pillar.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [selectedFilter, campaignData?.content_calendar]);

  return (
    <div className="min-h-screen p-4 text-white">
      {/* Header */}
      <div className="mb-6">
        <div className=" rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">P</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                PUMA Content Calendar
              </h1>
              <p className="text-gray-400">
                {campaignData.campaign_strategy.creative_direction}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400">
                {campaignData.campaign_timeline.total_posts}
              </div>
              <div className="text-sm text-blue-400">Total Posts</div>
            </div>
            <div className="bg-green-900/30 p-3 rounded-lg border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">
                {campaignData.campaign_timeline.duration_weeks}
              </div>
              <div className="text-sm text-green-400">Weeks</div>
            </div>
            <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400">
                {campaignData.campaign_strategy.primary_pillars.length}
              </div>
              <div className="text-sm text-purple-400">Content Pillars</div>
            </div>
            <div className="bg-orange-900/30 p-3 rounded-lg border border-orange-500/30">
              <div className="text-2xl font-bold text-orange-400">3</div>
              <div className="text-sm text-orange-400">Platforms</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-neutral-800 text-white"
          >
            <option value="all">All Content</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="educational">Educational</option>
            <option value="inspirational">Inspirational</option>
            <option value="community">Community</option>
            <option value="entertainment">Entertainment</option>
          </select>
        </div>
        <div className="flex bg-neutral-800 rounded-lg border border-gray-600 overflow-hidden">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "calendar"
                ? "bg-blue-500 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Calendar size={16} className="inline mr-2" />
            Calendar View
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-blue-500 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Eye size={16} className="inline mr-2" />
            List View
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "calendar" ? (
        <CalendarView
          posts={filteredPosts}
          timeline={campaignData.campaign_timeline}
          onPostSelect={setSelectedPost}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {filteredPosts.map((post, index) => (
            <PostCard key={index} post={post} onClick={setSelectedPost} />
          ))}
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default ContentCalendar;
