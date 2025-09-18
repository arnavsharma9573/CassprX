"use client";
import React from "react";
import Link from "next/link";
import { RootState } from "@/store/store";
import { setActiveBrand, addBrand } from "@/store/feature/brandSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  Plus,
  Calendar,
  BarChart3,
  Settings,
  Zap,
  ArrowRight,
  Globe,
  Target,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { brands, activeBrandId } = useAppSelector(
    (state: RootState) => state.brand
  );
  const dispatch = useAppDispatch();

  // Example: add dummy brand (replace with modal or form later)
  const handleCreateBrand = () => {
    const newBrand = {
      id: Date.now().toString(),
      name: "New Brand",
      description: "A freshly created brand profile",
    };
    dispatch(addBrand(newBrand));
    dispatch(setActiveBrand(newBrand.id));
  };

  const handleSelectBrand = (brandId: string) => {
    dispatch(setActiveBrand(brandId));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-700/30 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Your Brands
              </h1>
              <p className="text-slate-300 mt-2 text-sm">
                Manage your brand profiles and social media campaigns
              </p>
            </div>

            {/* Create Brand Button */}
            <button
              onClick={handleCreateBrand}
              className="group relative overflow-hidden px-2 py-2 rounded-xl bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-amber-400 hover:to-orange-400 text-black font-semibold transition-all duration-300 transform hover:scale-[1.03] shadow-lg hover:shadow-amber-500/30 flex items-center space-x-2"
            >
              <Plus size={20} color="white" />
              <span className="text-white text-sm font-light">Create Brand Profile</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 transition-all duration-300 hover:border-slate-600/60">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-300 text-sm">Total Brands</p>
                <p className="text-2xl font-bold text-white">
                  {brands.filter((b) => !b.isDefault).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 transition-all duration-300 hover:border-slate-600/60">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-300 text-sm">Active Campaigns</p>
                <p className="text-2xl font-bold text-white">-</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 transition-all duration-300 hover:border-slate-600/60">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-300 text-sm">Total Posts</p>
                <p className="text-2xl font-bold text-white">-</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-5 transition-all duration-300 hover:border-slate-600/60">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-slate-300 text-sm">Total Reach</p>
                <p className="text-2xl font-bold text-white">-</p>
              </div>
            </div>
          </div>
        </div>

        {brands.filter((b) => !b.isDefault).length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center shadow-lg">
              <Plus size={32} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Create Your First Brand Profile
            </h3>
            <p className="text-slate-300 mb-7 max-w-md mx-auto leading-relaxed">
              Set up your brand profile to start creating engaging social media
              campaigns with AI-powered insights and automation.
            </p>
            <button
              onClick={handleCreateBrand}
              className="px-8 py-3.5 bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-amber-500/20"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((brand, index) => {
            // Generate consistent colors based on brand id
            const colors = [
              "from-blue-500 to-cyan-500",
              "from-green-500 to-emerald-500",
              "from-purple-500 to-pink-500",
              "from-red-500 to-rose-500",
              "from-indigo-500 to-purple-500",
              "from-teal-500 to-green-500",
              "from-orange-500 to-red-500",
            ];
            const brandColor = brand.isDefault
              ? "from-amber-500 to-orange-500"
              : colors[index % colors.length];

            return (
              <div
                key={brand.id}
                className={`group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                  activeBrandId === brand.id
                    ? "ring-2 ring-amber-400 shadow-lg shadow-amber-400/20"
                    : "hover:shadow-xl"
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${brandColor} opacity-10 group-hover:opacity-15 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative bg-slate-800/70 backdrop-blur-sm border border-slate-700/40 hover:border-amber-400/40 p-5 h-full transition-colors duration-300">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${brandColor} shadow-md`}
                    >
                      {brand.isDefault ? (
                        <Zap className="w-5 h-5 text-black" />
                      ) : (
                        <Globe className="w-5 h-5 text-black" />
                      )}
                    </div>

                    {!brand.isDefault && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-slate-700/50 text-slate-300 rounded-full">
                        Brand
                      </span>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {brand.name}
                    </h2>
                    {brand.description && (
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {brand.description}
                      </p>
                    )}
                  </div>

                  {/* Select Brand Button */}
                  <div className="mb-4">
                    <button
                      onClick={() => handleSelectBrand(brand.id)}
                      className={`w-full px-4 py-2.5 border rounded-lg font-medium transition-all duration-200 ${
                        activeBrandId === brand.id
                          ? "bg-gradient-to-r from-amber-500/30 to-orange-500/30 border-amber-400 text-amber-400"
                          : "bg-slate-700/30 hover:bg-slate-700/50 border-slate-600/50 text-slate-300 hover:text-white"
                      }`}
                    >
                      {activeBrandId === brand.id
                        ? "Selected Brand"
                        : "Select Brand"}
                    </button>
                  </div>

                  {/* Action Links */}
                  <div className="space-y-2.5">
                    {/* Default workspace leads to agent tools */}
                    {brand.isDefault && (
                      <Link
                        href={`/dashboard/agents`}
                        className="flex items-center justify-between w-full px-4 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 rounded-lg text-amber-400 font-medium transition-all duration-300 group/link"
                      >
                        <div className="flex items-center space-x-2">
                          <Zap size={16} />
                          <span>Open Agents</span>
                        </div>
                        <ArrowRight
                          size={16}
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </Link>
                    )}

                    {/* Only show link if not default */}
                    {!brand.isDefault && (
                      <>
                        <Link
                          href={`/dashboard/${brand.id}/create-calendar`}
                          className="flex items-center justify-between w-full px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-all duration-300 group/link"
                        >
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>Create Calendar</span>
                          </div>
                          <ArrowRight
                            size={16}
                            className="group-hover/link:translate-x-1 transition-transform"
                          />
                        </Link>

                        <div className="flex space-x-2.5">
                          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 rounded-md text-slate-300 text-sm transition-all duration-300">
                            <BarChart3 size={14} className="mr-1.5" />
                            Analytics
                          </button>
                          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/50 rounded-md text-slate-300 text-sm transition-all duration-300">
                            <Settings size={14} className="mr-1.5" />
                            Settings
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
