import React from "react";
import { LucideIcon } from "lucide-react";
import { GlowingEffect } from "../ui/glowing-effect";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconBgColor: string;
  iconColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  iconBgColor,
  iconColor,
}) => {
  return (
    <div className="relative bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-lg p-3 transition-all duration-200 hover:border-neutral-700/70 hover:bg-neutral-900/60">
      {/* glowing effect overlay */}
      <GlowingEffect
        spread={10}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        className="absolute inset-0 rounded-lg"
      />

      {/* actual card content */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-medium tracking-wide mb-1">
            {label}
          </p>
          <p className="text-lg font-semibold text-white tracking-tight">
            {value}
          </p>
        </div>
        <div className={`p-2 ${iconBgColor} rounded-md ml-3 flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
