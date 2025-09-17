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
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-neutral-800 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded text-white ${
                  platformColors[post.platform]
                }`}
              >
                <PlatformIcon platform={post.platform} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {post.content_concept.title}
                </h2>
                <p className="text-gray-400">
                  {formatDate(post.date)} • {post.platform}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 text-xl"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-white">
                  Content Details
                </h3>
                <div className="bg-gray-900/50 p-4 rounded-lg space-y-2 border border-gray-700">
                  <p className="text-gray-300">
                    <strong className="text-white">Hook:</strong>{" "}
                    {post.content_concept.hook}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Description:</strong>{" "}
                    {post.content_concept.description}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">CTA:</strong>{" "}
                    {post.content_concept.call_to_action}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">
                  Creative Elements
                </h3>
                <div className="bg-gray-900/50 p-4 rounded-lg space-y-2 border border-gray-700">
                  <p className="text-gray-300">
                    <strong className="text-white">Format:</strong>{" "}
                    {post.creative_elements.format}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Visual Concept:</strong>{" "}
                    {post.creative_elements.visual_concept}
                  </p>
                  <div>
                    <strong className="text-white">Hashtags:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.creative_elements.hashtag_strategy.map(
                        (tag: string) => (
                          <span
                            key={tag}
                            className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-sm border border-blue-500/30"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-white">
                  Strategy & Goals
                </h3>
                <div className="bg-gray-900/50 p-4 rounded-lg space-y-2 border border-gray-700">
                  <p className="text-gray-300">
                    <strong className="text-white">Week Focus:</strong>{" "}
                    {post.strategic_context.week_focus}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Funnel Stage:</strong>{" "}
                    {post.funnel_stage}
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-white">Expected Engagement:</strong>{" "}
                    {post.strategic_context.expected_engagement}
                  </p>
                  <div>
                    <strong className="text-white">Success Metrics:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {post.strategic_context.success_metrics.map(
                        (metric: string) => (
                          <li key={metric} className="text-sm text-gray-300">
                            {metric}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">
                  Production Requirements
                </h3>
                <div className="bg-gray-900/50 p-4 rounded-lg space-y-2 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      <strong className="text-white">Effort Level:</strong>
                    </span>
                    <span
                      className={`px-3 py-1 rounded ${
                        effortLevelColors[
                          post.production_requirements.effort_level
                        ]
                      }`}
                    >
                      {post.production_requirements.effort_level}
                    </span>
                  </div>
                  <p className="text-gray-300">
                    <strong className="text-white">Prep Time:</strong>{" "}
                    {post.production_requirements.preparation_time}
                  </p>
                  <div>
                    <strong className="text-white">Resources Needed:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {post.production_requirements.resources_needed.map(
                        (resource: string) => (
                          <li key={resource} className="text-sm text-gray-300">
                            {resource}
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
