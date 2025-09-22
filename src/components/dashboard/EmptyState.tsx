import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateBrand: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateBrand }) => {
  return (
    <div className="text-center py-20">
      <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center shadow-xl border border-amber-500/20">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-xl flex items-center justify-center">
          <Plus size={28} className="text-amber-400" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">
        Create Your First Brand Profile
      </h3>
      <p className="text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed text-lg">
        Set up your brand profile to start creating engaging social media
        campaigns with AI-powered insights and automation.
      </p>
      <button
        onClick={onCreateBrand}
        className="px-8 py-4 bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25 text-lg"
      >
        Get Started
      </button>
    </div>
  );
};