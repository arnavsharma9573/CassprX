import React from "react";
import PlatformIcon from "./PlatformIcon";
import { Post } from "@/types/calender";
import {
  effortLevelColors,
  formatDate,
  platformColors,
} from "@/utils/constants";
import { getPlatformName } from "@/lib/helper";

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const platformName = getPlatformName(post.platform);
  const platformColorClass =
    platformColors[platformName] || platformColors.Default;
  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        className="bg-neutral-950 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-neutral-900/80 to-neutral-950 border-b border-white/5 p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className={`shadow-lg`}>
                <PlatformIcon platform={getPlatformName(post.platform)} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-white mb-2 leading-tight">
                  {post.content_concept.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <span>{post.platform}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-140px)] p-8">
          <div className="max-w-3xl mx-auto space-y-10">
            {/* Content Details */}
            <section>
              <h3
                className={`text-xs font-semibold uppercase tracking-wider mb-5 ${platformColorClass}`}
              >
                Content Details
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Hook
                  </label>
                  <p className="text-white/90 text-base leading-relaxed">
                    {post.content_concept.hook}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Description
                  </label>
                  <p className="text-white/90 text-base leading-relaxed">
                    {post.content_concept.description}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Call to Action
                  </label>
                  <p className="text-white/90 text-base leading-relaxed">
                    {post.content_concept.call_to_action}
                  </p>
                </div>
              </div>
            </section>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Creative Elements */}
            <section>
              <h3
                className={`text-xs font-semibold uppercase tracking-wider mb-5 ${platformColorClass}`}
              >
                Creative Elements
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Format
                  </label>
                  <p className="text-white/90 text-base">
                    {post.creative_elements.format}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Visual Concept
                  </label>
                  <p className="text-white/90 text-base leading-relaxed">
                    {post.creative_elements.visual_concept}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Hashtags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {post.creative_elements.hashtag_strategy.map(
                      (tag: string) => (
                        <span
                          key={tag}
                          className="text-sm text-white/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          #{tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Strategy & Goals */}
            <section>
              <h3
                className={`text-xs font-semibold uppercase tracking-wider mb-5 ${platformColorClass}`}
              >
                Strategy & Goals
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Week Focus
                  </label>
                  <p className="text-white/90 text-base">
                    {post.strategic_context.week_focus}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Funnel Stage
                  </label>
                  <p className="text-white/90 text-base">{post.funnel_stage}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Expected Engagement
                  </label>
                  <p className="text-white/90 text-base">
                    {post.strategic_context.expected_engagement}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Success Metrics
                  </label>
                  <ul className="space-y-2">
                    {post.strategic_context.success_metrics.map(
                      (metric: string) => (
                        <li
                          key={metric}
                          className="text-white/90 text-base flex items-start"
                        >
                          <span className="text-white/40 mr-3 mt-1">•</span>
                          <span>{metric}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </section>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Production Requirements */}
            <section>
              <h3
                className={`text-xs font-semibold uppercase tracking-wider mb-5 ${platformColorClass}`}
              >
                Production Requirements
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Effort Level
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-white/90 text-base">
                      Effort Required:
                    </span>
                    <span
                      className={`text-sm px-3 py-1 rounded-lg font-medium ${
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
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Prep Time
                  </label>
                  <p className="text-white/90 text-base">
                    {post.production_requirements.preparation_time}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/60 mb-2 block uppercase tracking-wide">
                    Resources Needed
                  </label>
                  <ul className="space-y-2">
                    {post.production_requirements.resources_needed.map(
                      (resource: string) => (
                        <li
                          key={resource}
                          className="text-white/90 text-base flex items-start"
                        >
                          <span className="text-white/40 mr-3 mt-1">•</span>
                          <span>{resource}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
