import React from "react";
import PlatformIcon from "./PlatformIcon";
import { Post } from "@/types/calender";
import {
  effortLevelColors,
  formatDate,
  platformColors,
} from "@/utils/constants";

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-neutral-900 to-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-lg text-white ${
                  platformColors[post.platform]
                } shadow-lg`}
              >
                <PlatformIcon platform={post.platform} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {post.content_concept.title}
                </h2>
                <p className="text-gray-400 text-sm">
                  {formatDate(post.date)} • {post.platform}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-xl bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Content Details */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700 shadow-inner">
                <h3 className="font-semibold mb-3 text-white text-lg flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Content Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Hook
                    </p>
                    <p className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      {post.content_concept.hook}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Description
                    </p>
                    <p className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      {post.content_concept.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Call to Action
                    </p>
                    <p className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      {post.content_concept.call_to_action}
                    </p>
                  </div>
                </div>
              </div>

              {/* Creative Elements */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700 shadow-inner">
                <h3 className="font-semibold mb-3 text-white text-lg flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Creative Elements
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Format
                    </p>
                    <p className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      {post.creative_elements.format}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Visual Concept
                    </p>
                    <p className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      {post.creative_elements.visual_concept}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Hashtags
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {post.creative_elements.hashtag_strategy.map(
                        (tag: string) => (
                          <span
                            key={tag}
                            className="bg-blue-900/40 text-blue-200 px-3 py-1.5 rounded-lg text-sm border border-blue-600/30"
                          >
                            #{tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Strategy & Goals */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700 shadow-inner">
                <h3 className="font-semibold mb-3 text-white text-lg flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Strategy & Goals
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Week Focus
                    </p>
                    <p className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      {post.strategic_context.week_focus}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Funnel Stage
                    </p>
                    <p className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      {post.funnel_stage}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Expected Engagement
                    </p>
                    <p className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      {post.strategic_context.expected_engagement}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Success Metrics
                    </p>
                    <ul className="space-y-2 mt-1">
                      {post.strategic_context.success_metrics.map(
                        (metric: string) => (
                          <li
                            key={metric}
                            className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700 text-sm"
                          >
                            • {metric}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Production Requirements */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl border border-gray-700 shadow-inner">
                <h3 className="font-semibold mb-3 text-white text-lg flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Production Requirements
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Effort Level
                    </p>
                    <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      <span className="text-white">Effort Required</span>
                      <span
                        className={`px-3 py-1.5 rounded-lg font-medium ${
                          effortLevelColors[
                            post.production_requirements.effort_level
                          ]
                        }`}
                      >
                        {post.production_requirements.effort_level}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Prep Time
                    </p>
                    <p className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                      {post.production_requirements.preparation_time}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">
                      Resources Needed
                    </p>
                    <ul className="space-y-2 mt-1">
                      {post.production_requirements.resources_needed.map(
                        (resource: string) => (
                          <li
                            key={resource}
                            className="text-white bg-gray-800/50 p-3 rounded-lg border border-gray-700 text-sm"
                          >
                            • {resource}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
