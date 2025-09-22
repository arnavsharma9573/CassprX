import React from 'react';
import { LucideIcon } from 'lucide-react';

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
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-6 transition-all duration-300 hover:border-slate-600/60 hover:bg-slate-800/80">
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${iconBgColor} rounded-xl shadow-md`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
};