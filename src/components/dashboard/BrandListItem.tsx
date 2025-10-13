import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Zap,
  Calendar,
  BarChart3,
  ArrowRight,
  Binoculars,
} from "lucide-react";
import { useAppSelector } from "@/hooks/redux-hooks";
import { RootState } from "@/store/store";
import BrandKitDrawer from "./BrandKitDrawer";
import { GlowingEffect } from "../ui/glowing-effect";
import Image from "next/image";

interface Brand {
  [x: string]: any;
  id: string;
  name: string;
  description?: string;
  status?: "queued" | "running" | "completed" | "failed";
  isDefault?: boolean;
}

interface BrandListItemProps {
  brand: Brand;
  isActive: boolean;
  onSelect: (brandId: string) => void;
  colorIndex: number;
  onOpenBrandKit?: () => void;
  isLoading?: boolean;
}

export const BrandListItem: React.FC<BrandListItemProps> = ({
  brand,
  isActive,
  onSelect,
  colorIndex,
  onOpenBrandKit,
  isLoading,
}) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { activeBrandId, brands } = useAppSelector(
    (state: RootState) => state.brand
  );
  const activeBrand = brands.find((b) => b.id === activeBrandId);
  const brandKit = activeBrand?.brandKits?.[0];

  return (
    <div className="group relative overflow-hidden rounded-xl transition-all duration-300">
      <div
        className={`relative backdrop-blur-sm border-2 transition-all duration-300 rounded-xl ${
          isActive
            ? "border-gray-300"
            : "border-slate-700/40 group-hover:border-slate-600/60"
        }`}
        onClick={() => onSelect(brand.id)}
      >
        <GlowingEffect
          spread={10}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          className="absolute inset-0"
        />
        {/* Main Content Row */}
        <div className="flex items-center p-5 space-x-4">
          {/* Brand Icon */}
          <div className="p-2.5 rounded-lg bg-neutral-800/80 border border-neutral-700/50 transition-all duration-300 group-hover:bg-neutral-700/50 flex items-center justify-center">
            {brand.isDefault ? (
              <Zap className="w-5 h-5 text-neutral-400 group-hover:text-amber-400 transition-colors duration-300" />
            ) : brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name || "Brand logo"}
                width={32}
                height={32}
                className="rounded-md object-cover"
              />
            ) : (
              <Globe className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors duration-300" />
            )}
          </div>

          {/* Brand Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1.5">
              <h3 className="text-base font-semibold text-white truncate">
                {brand.brandKits?.[0]?.kitData?.brand_name || brand.name}
              </h3>
              {brand.isDefault ? (
                <span className="px-2.5 py-0.5 text-xs font-medium bg-sky-500/20 text-sky-400 rounded-full border border-sky-500/30">
                  Default
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-700/50 text-slate-300 rounded-full border border-slate-600/50">
                  Brand
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {brand.description && (
                <p className="text-slate-200 text-sm truncate">
                  {brand.description}
                </p>
              )}
              {brand.status && !brand.isDefault && (
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    brand.status === "queued"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : brand.status === "running"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : brand.status === "completed"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : brand.status === "failed"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-neutral-500/20 text-neutral-400 border border-neutral-500/30"
                  }`}
                >
                  {brand.status.charAt(0).toUpperCase() + brand.status.slice(1)}
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {/* <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <p className="text-slate-500 text-xs">Posts</p>
              <p className="text-white font-semibold">-</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-xs">Reach</p>
              <p className="text-white font-semibold">-</p>
            </div>
          </div> */}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* <button
              onClick={() => onSelect(brand.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${
      isActive
        ? "bg-slate-200/10 text-white ring-1 ring-slate-400/30 shadow-sm hover:bg-slate-200/20"
        : "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 ring-1 ring-slate-700/60"
    }`}
            >
              {isActive ? "Selected" : "Select"}
            </button> */}

            {/* <button className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 text-slate-400 hover:text-white transition-all duration-200">
              <MoreVertical size={16} />
            </button> */}
          </div>
        </div>

        {/* Expanded Actions */}
        <div
          className={`border-t border-slate-700/50 px-5 overflow-hidden transition-all duration-500 ease-in-out ${
            isActive
              ? "max-h-40 opacity-100 py-3"
              : "max-h-0 opacity-0 py-0 group-hover:max-h-40 group-hover:opacity-100 group-hover:py-3"
          }`}
        >
          <div className="flex flex-wrap gap-2 transition-all duration-500 ease-in-out">
            {brand.isDefault ? (
              <Link
                href="/dashboard/workspace"
                className="flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-lg text-white text-sm font-medium transition-all duration-300 group/link hover:bg-neutral-900 hover:scale-105 hover:border-transparent"
              >
                <Zap size={14} />
                <span>Open Agents</span>
                <ArrowRight
                  size={14}
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
                    if (!isActive) e.preventDefault();
                  }}
                  className={`flex items-center space-x-2 px-3 py-1.5 border rounded-lg text-sm font-medium transition-all duration-300 group/link ${
                    isActive
                      ? "bg-slate-700/50 hover:bg-slate-700/70 border-slate-600/50 text-slate-300 hover:text-white cursor-pointer"
                      : "bg-slate-700/30 border-slate-700/30 text-slate-500 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <Calendar size={14} />
                  <span>Create Calendar</span>
                  <ArrowRight
                    size={14}
                    className={
                      isActive
                        ? "group-hover/link:translate-x-1 transition-transform"
                        : ""
                    }
                  />
                </Link>

                <button
                  onClick={() => onOpenBrandKit?.()}
                  disabled={!isActive}
                  className={`flex items-center space-x-2 px-3 py-1.5 border rounded-lg text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-slate-700/50 hover:bg-slate-700/70 border-slate-600/50 text-slate-300 hover:text-white cursor-pointer"
                      : "bg-slate-700/30 border-slate-700/30 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 size={14} />
                      <span>Create Brand Kit</span>{" "}
                    </>
                  )}
                </button>

                <button
                  onClick={() => setDrawerOpen(true)}
                  disabled={!isActive}
                  className={`flex items-center space-x-2 px-3 py-1.5 border rounded-lg text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-slate-700/50 hover:bg-slate-700/70 border-slate-600/50 text-slate-300 hover:text-white cursor-pointer"
                      : "bg-slate-700/30 border-slate-700/30 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Binoculars size={14} />
                  <span>View Brand Kit</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <BrandKitDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        kit={brandKit}
      />
    </div>
  );
};
