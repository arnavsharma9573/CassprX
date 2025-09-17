import { LucideProps } from 'lucide-react';
import React from 'react';

// --- Type Definitions ---

export type Platform = 'Instagram' | 'Facebook' | 'YouTube' | 'TikTok';
export type ContentPillar =
  | 'Educational'
  | 'Inspirational'
  | 'Community'
  | 'Entertainment'
  | 'Behind-the-Scenes';
export type EffortLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ViewMode = 'calendar' | 'list';

export interface ContentConcept {
  concept_id: string;
  title: string;
  description: string;
  hook: string;
  value_proposition: string;
  call_to_action: string;
  engagement_tactics: string[];
}

export interface CreativeElements {
  format: string;
  visual_concept: string;
  copy_angle: string;
  hashtag_strategy: string[];
  viral_triggers: string[];
}

export interface StrategicContext {
  week_focus: string;
  psychological_principle: string;
  expected_engagement: string;
  success_metrics: string[];
  optimization_notes: string;
}

export interface ProductionRequirements {
  effort_level: EffortLevel;
  resources_needed: string[];
  preparation_time: string;
  collaboration_needs: string;
}

export interface Post {
  post_number: number;
  date: string;
  day_of_week: string;
  week_number: number;
  platform: Platform;
  content_pillar: ContentPillar;
  funnel_stage: string;
  content_concept: ContentConcept;
  creative_elements: CreativeElements;
  strategic_context: StrategicContext;
  production_requirements: ProductionRequirements;
}

export interface CampaignStrategy {
  creative_direction: string;
  primary_pillars: string[];
  viral_elements: string[];
  differentiation: string;
  campaign_arc: string;
}

export interface CampaignTimeline {
  duration_weeks: number;
  start_date: string;
  end_date: string;
  total_posts: number;
  posts_per_week: number;
  posting_days: string[];
  weekly_themes: string[];
}

export interface CampaignData {
  campaign_strategy: CampaignStrategy;
  campaign_timeline: CampaignTimeline;
  content_calendar: Post[];
}

export interface PlatformIconProps {
    platform: Platform;
}

export type PlatformIcons = Record<string, React.ComponentType<LucideProps>>;
