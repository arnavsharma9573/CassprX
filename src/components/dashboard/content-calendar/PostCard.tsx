import React from "react";

import PlatformIcon from "./PlatformIcon";
import { Post } from "@/types/calender";
import {
  effortLevelColors,
  formatDate,
  pillarColors,
  platformColors,
} from "@/utils/constants";

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => (
  <div
    className="bg-neutral-800 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-200 border border-gray-700 hover:border-gray-600 border-l-4"
    style={{
      borderLeftColor: platformColors[post.platform]
        ?.replace("bg-gradient-to-r from-purple-500 to-pink-500", "#8B5CF6")
        .replace("bg-blue-600", "#2563EB")
        .replace("bg-red-600", "#DC2626"),
    }}
    onClick={() => onClick(post)}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <div
          className={`p-1 rounded text-white ${
            platformColors[post.platform] || "bg-gray-500"
          }`}
        >
          <PlatformIcon platform={post.platform} />
        </div>
        <span className="font-medium text-sm text-gray-200">
          {post.platform}
        </span>
      </div>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          pillarColors[post.content_pillar] ||
          "bg-neutral-800/50 text-gray-300 border-gray-500/50"
        }`}
      >
        {post.content_pillar}
      </span>
    </div>
    <h3 className="font-semibold text-sm mb-1 text-white">
      {post.content_concept.title}
    </h3>
    <p className="text-xs text-gray-400 mb-2 line-clamp-2">
      {post.content_concept.description}
    </p>
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-500">{formatDate(post.date)}</span>
      <span
        className={`px-2 py-1 rounded ${
          effortLevelColors[post.production_requirements.effort_level]
        }`}
      >
        {post.production_requirements.effort_level}
      </span>
    </div>
  </div>
);

export default PostCard;
