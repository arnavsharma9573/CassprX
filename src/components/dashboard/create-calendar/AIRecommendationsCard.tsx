import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AIRecommendations } from "@/types/calender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Brain, 
  Calendar, 
  CheckCircle,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Globe
} from "lucide-react";

interface AIRecommendationsCardProps {
  aiRecommendations: AIRecommendations;
  onConfirm: (selectedPlatforms: string[], selectedDuration: number) => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

// Platform mapping for icons and URLs
const platformMap = {
  'LinkedIn': { icon: Linkedin, url: 'https://www.linkedin.com/', color: 'text-blue-500' },
  'Instagram': { icon: Instagram, url: 'https://www.instagram.com/', color: 'text-pink-500' },
  'YouTube': { icon: Youtube, url: 'https://www.youtube.com/', color: 'text-red-500' },
  'Facebook': { icon: Facebook, url: 'https://www.facebook.com/', color: 'text-blue-600' },
  'Twitter': { icon: Twitter, url: 'https://www.twitter.com/', color: 'text-blue-400' },
};

export default function AIRecommendationsCard({ 
  aiRecommendations, 
  onConfirm, 
  onCancel, 
  isConfirming = false 
}: AIRecommendationsCardProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(6);

  // Extract platform names from the AI recommendations text
  const extractPlatforms = (text: string) => {
    const platforms = [];
    const platformNames = Object.keys(platformMap);
    
    for (const platform of platformNames) {
      if (text.toLowerCase().includes(platform.toLowerCase())) {
        platforms.push(platform);
      }
    }
    
    return platforms;
  };

  // Extract duration from AI recommendations
  const extractDuration = (text: string) => {
    const match = text.match(/(\d+)\s*weeks?/i);
    return match ? parseInt(match[1]) : 6;
  };

  useEffect(() => {
    // Auto-select platforms and duration from AI recommendations
    const platforms = extractPlatforms(aiRecommendations.platforms);
    const duration = extractDuration(aiRecommendations.duration);
    
    setSelectedPlatforms(platforms);
    setSelectedDuration(duration);
  }, [aiRecommendations]);

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
  };

  const handleConfirm = () => {
    const platformUrls = selectedPlatforms.map(platform => 
      platformMap[platform as keyof typeof platformMap]?.url || `https://www.${platform.toLowerCase()}.com/`
    );
    onConfirm(platformUrls, selectedDuration);
  };

  const availablePlatforms = Object.keys(platformMap);

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
              <Brain className="w-6 h-6 text-purple-500" />
              AI Recommendations
            </CardTitle>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Review & Select
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* AI Platform Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <Globe className="w-4 h-4" />
              Recommended Platforms
            </div>
            <div className="p-3 bg-neutral-800/50 rounded-lg">
              <div className="text-white text-sm leading-relaxed whitespace-pre-line">
                {aiRecommendations.platforms}
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-neutral-300">
              Select Platforms
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availablePlatforms.map((platform) => {
                const IconComponent = platformMap[platform as keyof typeof platformMap]?.icon;
                const color = platformMap[platform as keyof typeof platformMap]?.color;
                const isSelected = selectedPlatforms.includes(platform);
                
                return (
                  <motion.div
                    key={platform}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-[#E6A550] bg-[#E6A550]/10' 
                        : 'border-neutral-600 bg-neutral-800/50 hover:border-neutral-500'
                    }`}
                    onClick={() => handlePlatformToggle(platform)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handlePlatformToggle(platform)}
                        className="data-[state=checked]:bg-[#E6A550] data-[state=checked]:border-[#E6A550]"
                      />
                      {IconComponent && (
                        <IconComponent className={`w-5 h-5 ${color}`} />
                      )}
                      <span className="text-white text-sm font-medium">
                        {platform}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* AI Duration Recommendation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-300">
              <Calendar className="w-4 h-4" />
              Recommended Duration
            </div>
            <div className="p-3 bg-neutral-800/50 rounded-lg">
              <div className="text-white text-sm leading-relaxed">
                {aiRecommendations.duration}
              </div>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-neutral-300">
              Select Duration (weeks)
            </div>
            <div className="flex gap-2 flex-wrap">
              {[4, 6, 8, 10, 12].map((weeks) => (
                <motion.button
                  key={weeks}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDurationChange(weeks)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDuration === weeks
                      ? 'bg-[#E6A550] text-black'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  {weeks} weeks
                </motion.button>
              ))}
            </div>
          </div>

          {/* Selection Summary */}
          <div className="p-4 bg-neutral-800/30 rounded-lg border border-neutral-700">
            <div className="text-sm font-medium text-neutral-300 mb-2">Selection Summary:</div>
            <div className="text-white text-sm">
              <div>Platforms: {selectedPlatforms.length > 0 ? selectedPlatforms.join(', ') : 'None selected'}</div>
              <div>Duration: {selectedDuration} weeks</div>
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
              onClick={handleConfirm}
              disabled={isConfirming || selectedPlatforms.length === 0}
              className="flex-1 bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-[#BC853B] hover:to-[#E6A550] text-black font-semibold disabled:opacity-50"
            >
              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Finalizing...
                </div>
              ) : (
                "Finalize Campaign"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}