import React, { useState } from "react";
import { motion } from "framer-motion";
import { CampaignPlan } from "@/types/calender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Target,
  Users,
  TrendingUp,
  Calendar,
  Lightbulb,
  CheckCircle,
  Linkedin,
  Instagram,
  Twitter,
  Edit2,
  Plus,
  X,
  Save,
} from "lucide-react";

interface CampaignPlanCardProps {
  campaignPlan: CampaignPlan;
  onConfirm: (campaignPlan: CampaignPlan) => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

// Medium icon component (lucide doesn't have Medium)
const MediumIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);

interface PlatformIconData {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const PLATFORM_ICONS: Record<string, PlatformIconData> = {
  linkedin: {
    icon: Linkedin,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  instagram: {
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  twitter: { icon: Twitter, color: "text-sky-500", bgColor: "bg-sky-500/10" },
  medium: {
    icon: MediumIcon,
    color: "text-neutral-100",
    bgColor: "bg-neutral-700/30",
  },
};

export default function CampaignPlanCard({
  campaignPlan: initialCampaignPlan,
  onConfirm,
  onCancel,
  isConfirming = false,
}: CampaignPlanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [campaignPlan, setCampaignPlan] =
    useState<CampaignPlan>(initialCampaignPlan);
  const [newPlatformName, setNewPlatformName] = useState("");
  const [newPlatformFollowers, setNewPlatformFollowers] = useState("");

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const handleFieldChange = (
    field: keyof CampaignPlan,
    value: string | number
  ) => {
    setCampaignPlan((prev: CampaignPlan) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProductInfoChange = (field: string, value: string) => {
    setCampaignPlan((prev: CampaignPlan) => ({
      ...prev,
      product_info: {
        ...prev.product_info,
        [field]: value,
      },
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setCampaignPlan((prev: CampaignPlan) => ({
      ...prev,
      social_media_followers: {
        ...prev.social_media_followers,
        [platform]: parseInt(value) || 0,
      },
    }));
  };

  const addCustomPlatform = () => {
    if (newPlatformName && newPlatformFollowers) {
      const platformKey = newPlatformName.toLowerCase().replace(/\s+/g, "_");
      handleSocialMediaChange(platformKey, newPlatformFollowers);
      setNewPlatformName("");
      setNewPlatformFollowers("");
    }
  };

  const removePlatform = (platform: string) => {
    setCampaignPlan((prev: CampaignPlan) => {
      // preserve the same type shape as prev.social_media_followers so the returned object matches CampaignPlan
      const newFollowers = {
        ...prev.social_media_followers,
      } as unknown as CampaignPlan["social_media_followers"];
      // use a temporary any-cast to remove a dynamic key without breaking the strict SocialMediaFollowers type
      delete (newFollowers as any)[platform];
      return {
        ...prev,
        social_media_followers: newFollowers,
      };
    });
  };

  const handleContentIdeaChange = (index: number, value: string) => {
    const newIdeas = [...campaignPlan.content_ideas];
    newIdeas[index] = value;
    setCampaignPlan((prev: CampaignPlan) => ({
      ...prev,
      content_ideas: newIdeas,
    }));
  };

  const addContentIdea = () => {
    setCampaignPlan((prev: CampaignPlan) => ({
      ...prev,
      content_ideas: [...prev.content_ideas, ""],
    }));
  };

  const removeContentIdea = (index: number) => {
    setCampaignPlan((prev: CampaignPlan) => ({
      ...prev,
      content_ideas: prev.content_ideas.filter(
        (_: string, i: number) => i !== index
      ),
    }));
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = PLATFORM_ICONS[platform.toLowerCase()];
    if (platformData) {
      const Icon = platformData.icon;
      return <Icon className={`w-5 h-5 ${platformData.color}`} />;
    }
    return <Users className="w-5 h-5 text-neutral-400" />;
  };

  const getPlatformBgColor = (platform: string): string => {
    const platformData = PLATFORM_ICONS[platform.toLowerCase()];
    return platformData?.bgColor || "bg-neutral-800/50";
  };

  const handleSave = () => {
    setIsEditing(false);
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
              Campaign Plan {isEditing ? "- Editing" : "Ready"}
            </CardTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    Review & Confirm
                  </Badge>
                </>
              ) : (
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-[#BC853B] hover:to-[#E6A550] text-black font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
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
              {isEditing ? (
                <Input
                  value={campaignPlan.campaign_purpose}
                  onChange={(e) =>
                    handleFieldChange("campaign_purpose", e.target.value)
                  }
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              ) : (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {campaignPlan.campaign_purpose}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                <TrendingUp className="w-4 h-4" />
                Funnel Type
              </div>
              {isEditing ? (
                <Input
                  value={campaignPlan.selected_funnel.type}
                  onChange={(e) =>
                    setCampaignPlan((prev: CampaignPlan) => ({
                      ...prev,
                      selected_funnel: {
                        ...prev.selected_funnel,
                        type: e.target.value,
                      },
                    }))
                  }
                  className="bg-neutral-800 border-neutral-600 text-white"
                />
              ) : (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {campaignPlan.selected_funnel.type}
                </Badge>
              )}
            </div>
          </div>

          {/* Funnel Stages */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <TrendingUp className="w-4 h-4" />
              Funnel Stages
            </div>
            <div className="flex flex-wrap gap-2">
              {campaignPlan.selected_funnel.stages.map(
                (stage: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-neutral-600 text-neutral-300"
                  >
                    {stage}
                  </Badge>
                )
              )}
            </div>
          </div>

          {/* Social Media Followers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <Users className="w-4 h-4" />
              Social Media Reach
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(campaignPlan.social_media_followers).map(
                ([platform, followers]) => (
                  <div
                    key={platform}
                    className={`flex items-center gap-2 p-3 ${getPlatformBgColor(
                      platform
                    )} rounded-lg group relative`}
                  >
                    {getPlatformIcon(platform)}
                    <div className="flex-1">
                      <div className="text-sm text-neutral-400 capitalize">
                        {platform}
                      </div>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={followers as number}
                          onChange={(e) =>
                            handleSocialMediaChange(platform, e.target.value)
                          }
                          className="h-8 bg-neutral-900 border-neutral-600 text-white mt-1"
                        />
                      ) : (
                        <div className="font-semibold text-white">
                          {formatNumber(followers as number)} followers
                        </div>
                      )}
                    </div>
                    {isEditing &&
                      !["linkedin", "instagram", "twitter", "medium"].includes(
                        platform.toLowerCase()
                      ) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removePlatform(platform)}
                          className="absolute top-2 right-2 h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                  </div>
                )
              )}
            </div>

            {/* Add Custom Platform */}
            {isEditing && (
              <div className="p-4 bg-neutral-800/30 rounded-lg border border-dashed border-neutral-600">
                <div className="text-sm font-medium text-neutral-300 mb-3">
                  Add Another Platform
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Platform name"
                    value={newPlatformName}
                    onChange={(e) => setNewPlatformName(e.target.value)}
                    className="flex-1 bg-neutral-900 border-neutral-600 text-white"
                  />
                  <Input
                    type="number"
                    placeholder="Followers"
                    value={newPlatformFollowers}
                    onChange={(e) => setNewPlatformFollowers(e.target.value)}
                    className="w-32 bg-neutral-900 border-neutral-600 text-white"
                  />
                  <Button
                    onClick={addCustomPlatform}
                    size="sm"
                    className="bg-[#E6A550] hover:bg-[#BC853B] text-black"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Posting Frequency */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <Calendar className="w-4 h-4" />
              Posting Schedule
            </div>
            <div className="p-3 bg-neutral-800/50 rounded-lg">
              {isEditing ? (
                <Input
                  type="number"
                  value={campaignPlan.posting_frequency_per_week}
                  onChange={(e) =>
                    handleFieldChange(
                      "posting_frequency_per_week",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="bg-neutral-900 border-neutral-600 text-white"
                  placeholder="Posts per week"
                />
              ) : (
                <>
                  <div className="text-white font-semibold">
                    {campaignPlan.posting_frequency_per_week} posts per week
                  </div>
                  <div className="text-sm text-neutral-400">
                    Consistent engagement strategy
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <Target className="w-4 h-4" />
              Product Information
            </div>
            <div className="p-3 bg-neutral-800/50 rounded-lg space-y-2">
              {isEditing ? (
                <>
                  <Input
                    value={campaignPlan.product_info.type}
                    onChange={(e) =>
                      handleProductInfoChange("type", e.target.value)
                    }
                    className="bg-neutral-900 border-neutral-600 text-white"
                    placeholder="Product type"
                  />
                  <Textarea
                    value={campaignPlan.product_info.brand_data_summary}
                    onChange={(e) =>
                      handleProductInfoChange(
                        "brand_data_summary",
                        e.target.value
                      )
                    }
                    className="bg-neutral-900 border-neutral-600 text-white min-h-[80px]"
                    placeholder="Brand data summary"
                  />
                </>
              ) : (
                <>
                  <div className="text-sm text-neutral-400 mb-1">
                    Type: {campaignPlan.product_info.type}
                  </div>
                  <div className="text-white text-sm leading-relaxed">
                    {campaignPlan.product_info.brand_data_summary}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content Ideas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                <Lightbulb className="w-4 h-4" />
                Content Ideas ({campaignPlan.content_ideas.length})
              </div>
              {isEditing && (
                <Button
                  onClick={addContentIdea}
                  size="sm"
                  variant="outline"
                  className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Idea
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {campaignPlan.content_ideas.map((idea: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-3 bg-neutral-800/50 rounded-lg border-l-4 border-[#E6A550]"
                >
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Textarea
                        value={idea}
                        onChange={(e) =>
                          handleContentIdeaChange(index, e.target.value)
                        }
                        className="flex-1 bg-neutral-900 border-neutral-600 text-white min-h-[60px]"
                      />
                      <Button
                        onClick={() => removeContentIdea(index)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-white text-sm leading-relaxed">
                      {idea}
                    </div>
                  )}
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
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(campaignPlan)}
              disabled={isConfirming || isEditing}
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
