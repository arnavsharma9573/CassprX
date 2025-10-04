import React from "react";
import { motion } from "framer-motion";
import { CampaignPlan } from "@/types/calender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Users, 
  TrendingUp, 
  Calendar, 
  Lightbulb, 
  CheckCircle, 
  Linkedin,
  Instagram
} from "lucide-react";

interface CampaignPlanCardProps {
  campaignPlan: CampaignPlan;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export default function CampaignPlanCard({ 
  campaignPlan, 
  onConfirm, 
  onCancel, 
  isConfirming = false 
}: CampaignPlanCardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto p-4"
    >
      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Campaign Plan Ready
            </CardTitle>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              Review & Confirm
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Campaign Purpose & Funnel */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                <Target className="w-4 h-4" />
                Campaign Purpose
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {campaignPlan.campaign_purpose}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                <TrendingUp className="w-4 h-4" />
                Funnel Type
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {campaignPlan.selected_funnel.type}
              </Badge>
            </div>
          </div>

          {/* Funnel Stages */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <TrendingUp className="w-4 h-4" />
              Funnel Stages
            </div>
            <div className="flex flex-wrap gap-2">
              {campaignPlan.selected_funnel.stages.map((stage, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="border-neutral-600 text-neutral-300"
                >
                  {stage}
                </Badge>
              ))}
            </div>
          </div>

          {/* Social Media Followers */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <Users className="w-4 h-4" />
              Social Media Reach
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-neutral-800/50 rounded-lg">
                <Linkedin className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm text-neutral-400">LinkedIn</div>
                  <div className="font-semibold text-white">
                    {formatNumber(campaignPlan.social_media_followers.linkedin)} followers
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-neutral-800/50 rounded-lg">
                <Instagram className="w-5 h-5 text-pink-500" />
                <div>
                  <div className="text-sm text-neutral-400">Instagram</div>
                  <div className="font-semibold text-white">
                    {formatNumber(campaignPlan.social_media_followers.instagram)} followers
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posting Frequency */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <Calendar className="w-4 h-4" />
              Posting Schedule
            </div>
            <div className="p-3 bg-neutral-800/50 rounded-lg">
              <div className="text-white font-semibold">
                {campaignPlan.posting_frequency_per_week} posts per week
              </div>
              <div className="text-sm text-neutral-400">
                Consistent engagement strategy
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <Target className="w-4 h-4" />
              Product Information
            </div>
            <div className="p-3 bg-neutral-800/50 rounded-lg">
              <div className="text-sm text-neutral-400 mb-1">Type: {campaignPlan.product_info.type}</div>
              <div className="text-white text-sm leading-relaxed">
                {campaignPlan.product_info.brand_data_summary}
              </div>
            </div>
          </div>

          {/* Content Ideas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <Lightbulb className="w-4 h-4" />
              Content Ideas ({campaignPlan.content_ideas.length})
            </div>
            <div className="space-y-2">
              {campaignPlan.content_ideas.map((idea, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-neutral-800/50 rounded-lg border-l-4 border-[#E6A550]"
                >
                  <div className="text-white text-sm leading-relaxed">
                    {idea}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              Make Changes
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isConfirming}
              className="flex-1 bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-[#BC853B] hover:to-[#E6A550] text-black font-semibold"
            >
              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Confirming...
                </div>
              ) : (
                "Confirm & Continue"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
