import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Zap,
  Calendar,
  BarChart3,
  ArrowRight,
  MoreVertical,
  Binoculars,
} from "lucide-react";
import { useAppSelector } from "@/hooks/redux-hooks";
import { RootState } from "@/store/store";
import BrandKitDrawer from "./BrandKitDrawer";

interface Brand {
  id: string;
  name: string;
  description?: string;
  status?: "queued" | "running" | "completed" | "failed"; // add status
  isDefault?: boolean;
}

interface BrandListItemProps {
  brand: Brand;
  isActive: boolean;
  onSelect: (brandId: string) => void;
  colorIndex: number;
  onOpenBrandKit?: () => void;
}

export const BrandListItem: React.FC<BrandListItemProps> = ({
  brand,
  isActive,
  onSelect,
  colorIndex,
  onOpenBrandKit,
}) => {
  const colors = [
    {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      icon: "bg-blue-500/20",
    },
    {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-400",
      icon: "bg-green-500/20",
    },
    {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
      icon: "bg-purple-500/20",
    },
    {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      icon: "bg-red-500/20",
    },
    {
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
      text: "text-indigo-400",
      icon: "bg-indigo-500/20",
    },
    {
      bg: "bg-teal-500/10",
      border: "border-teal-500/30",
      text: "text-teal-400",
      icon: "bg-teal-500/20",
    },
    {
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-400",
      icon: "bg-orange-500/20",
    },
  ];

  const brandTheme = brand.isDefault
    ? {
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-400",
        icon: "bg-amber-500/20",
      }
    : colors[colorIndex % colors.length];

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { activeBrandId, brands } = useAppSelector(
    (state: RootState) => state.brand
  );
  const activeBrand = brands.find((b) => b.id === activeBrandId);
  const brandKit = activeBrand?.brandKits?.[0];

  return (
    <div
      className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
        isActive
          ? `ring-2 ring-amber-400/60 shadow-lg shadow-amber-400/10 ${brandTheme.bg}`
          : `hover:${brandTheme.bg} hover:shadow-lg`
      }`}
    >
      <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300">
        {/* Main Content Row */}
        <div className="flex items-center p-6 space-x-4">
          {/* Brand Icon */}
          <div
            className={`p-3 rounded-xl ${brandTheme.icon} ${brandTheme.border} border transition-all duration-300`}
          >
            {brand.isDefault ? (
              <Zap className={`w-6 h-6 ${brandTheme.text}`} />
            ) : (
              <Globe className={`w-6 h-6 ${brandTheme.text}`} />
            )}
          </div>

          {/* Brand Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-white truncate">
                {brand.name}
              </h3>
              {brand.isDefault ? (
                <span className="px-3 py-1 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                  Default Workspace
                </span>
              ) : (
                <span className="px-3 py-1 text-xs font-medium bg-slate-700/50 text-slate-300 rounded-full">
                  Brand Profile
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {brand.description && (
                <p className="text-slate-400 text-sm leading-relaxed truncate">
                  {brand.description}
                </p>
              )}
              {brand.status && !brand.isDefault && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    brand.status === "queued"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : brand.status === "running"
                      ? "bg-blue-500/20 text-blue-400"
                      : brand.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : brand.status === "failed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-neutral-500/20 text-neutral-400"
                  }`}
                >
                  {brand.status.charAt(0).toUpperCase() + brand.status.slice(1)}
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <p className="text-slate-400">Posts</p>
              <p className="text-white font-semibold">-</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Reach</p>
              <p className="text-white font-semibold">-</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSelect(brand.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? `bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 ${brandTheme.text}`
                  : "bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 text-slate-300 hover:text-white"
              }`}
            >
              {isActive ? "Selected" : "Select"}
            </button>

            <button className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 text-slate-400 hover:text-white transition-all duration-200">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Expanded Actions (when active or hovered) */}
        <div
          className={`
    border-t border-slate-700/50 px-6 overflow-hidden
    transition-all duration-500 ease-in-out
    ${
      isActive
        ? "max-h-40 opacity-100 py-4"
        : "max-h-0 opacity-0 py-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:py-4"
    }
  `}
        >
          <div className="flex flex-wrap gap-3 transition-all duration-500 ease-in-out">
            {brand.isDefault ? (
              <Link
                href="/dashboard/agents"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 rounded-lg text-amber-400 font-medium transition-all duration-300 group/link"
              >
                <Zap size={16} />
                <span>Open Agents</span>
                <ArrowRight
                  size={16}
                  className="group-hover/link:translate-x-1 transition-transform"
                />
              </Link>
            ) : (
              <>
                <Link
                  href={
                    isActive ? `/dashboard/${brand.id}/create-calendar` : "#"
                  }
                  onClick={(e) => {
                    if (!isActive) e.preventDefault(); // prevent navigation if not active
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg font-medium transition-all duration-300 group/link
    ${
      isActive
        ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-400 cursor-pointer"
        : "bg-slate-700/30 text-slate-500 cursor-not-allowed pointer-events-none"
    }  // disabled style
  `}
                >
                  <Calendar size={16} />
                  <span>Create Calendar</span>
                  <ArrowRight
                    size={16}
                    className={`transition-transform ${
                      isActive ? "group-hover/link:translate-x-1" : ""
                    }`}
                  />
                </Link>

                <button
                  onClick={() => onOpenBrandKit?.()}
                  disabled={!isActive} // <-- disable if not active
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-300
    ${
      isActive
        ? "bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white cursor-pointer"
        : "bg-slate-700/30 text-slate-500 cursor-not-allowed"
    }  // disabled styles
  `}
                >
                  <BarChart3 size={16} />
                  <span>Create Brand Kit</span>
                </button>

                <button
                  onClick={() => setDrawerOpen(true)}
                  disabled={!isActive}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-300
    ${
      isActive
        ? "bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white cursor-pointer"
        : "bg-slate-700/30 text-slate-500 cursor-not-allowed"
    }  // disabled styles
  `}
                >
                  <Binoculars size={16} />
                  <span>View Brand Kit</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      </div>
      <BrandKitDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        kit={brandKit}
      />
    </div>
  );
};
