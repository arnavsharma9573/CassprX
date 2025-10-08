import React from 'react';
import { Loader2 } from 'lucide-react';

export default function OverlayLoader() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700/50 flex flex-col items-center space-y-4">
        {/* Animated Loader */}
        <div className="relative">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-amber-500/20 animate-pulse" />
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Creating Brand Profile
          </h3>
          <p className="text-slate-400 text-sm">
            Please wait while we set up your brand...
          </p>
        </div>
        
        {/* Progress Animation */}
        <div className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 animate-progress" />
        </div>
      </div>
    </div>
  );
}