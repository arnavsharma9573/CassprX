import React from "react";
import PlatformIcon from "./PlatformIcon";
import { Post } from "@/types/calender";
import { formatDate, pillarColors } from "@/utils/constants";
import { getPlatformName } from "@/lib/helper";

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  // Get clean platform name
  const platformName = getPlatformName(post.platform);

  // Effort level colors
  const effortColors: Record<string, string> = {
    low: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    high: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div
      className="bg-neutral-900 rounded-lg p-4 cursor-pointer hover:bg-neutral-800/80 transition-colors border border-neutral-800 hover:border-neutral-700"
      onClick={() => onClick(post)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-neutral-800 text-white">
            <PlatformIcon platform={post.platform} />
          </div>
          <span className="font-medium text-sm text-white">{platformName}</span>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${
            pillarColors[post.content_pillar] ||
            "bg-neutral-800 text-neutral-300 border-neutral-700"
          }`}
        >
          {post.content_pillar}
        </span>
      </div>

      <h3 className="font-semibold text-base mb-2 text-white">
        {post.content_concept.title}
      </h3>

      <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
        {post.content_concept.description}
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-500">{formatDate(post.date)}</span>
        <span
          className={`px-2 py-1 rounded border ${
            effortColors[
              post.production_requirements.effort_level.toLowerCase()
            ] || "bg-neutral-800 text-neutral-400 border-neutral-700"
          }`}
        >
          {post.production_requirements.effort_level}
        </span>
      </div>
    </div>
  );
};

export default PostCard;
