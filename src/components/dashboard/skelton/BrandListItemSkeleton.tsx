import React from "react";

export const BrandListItemSkeleton = () => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-700/40 bg-slate-800/30 animate-pulse">
      <div className="flex items-center p-5 space-x-4">
        {/* Icon Placeholder */}
        <div className="p-3 rounded-lg bg-slate-700/50 h-10 w-10" />

        {/* Brand Info */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-700/60 rounded w-1/3" />
          <div className="h-3 bg-slate-700/50 rounded w-2/3" />
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <div className="h-8 w-20 bg-slate-700/50 rounded-lg" />
          <div className="h-8 w-8 bg-slate-700/50 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
