"use client";
import React, { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { setActiveBrand, addBrand } from "@/store/feature/brandSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { Plus, Globe, Target, BarChart3, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BrandListItem } from "@/components/dashboard/BrandListItem";
import { fetchCalendarDataByBrandId } from "@/store/feature/calendarSlice";
import BrandProfileDialog from "@/components/dashboard/CreateBrandProfileModal";
import BrandKitDialog from "@/components/dashboard/BrandKitDialog";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [brandKitOpen, setBrandKitOpen] = useState(false);
  const handleOpenBrandKit = () => setBrandKitOpen(true);

  const { brands, activeBrandId } = useAppSelector(
    (state: RootState) => state.brand
  );
  const dispatch = useAppDispatch();

  const hasActiveBrandData = useAppSelector(
    (state: RootState) =>
      !!(activeBrandId && state.calendar.dataByBrand[activeBrandId])
  );

  useEffect(() => {
    // Fetch only if an active brand is selected AND we don't already have its data
    if (activeBrandId && !hasActiveBrandData) {
      dispatch(fetchCalendarDataByBrandId(activeBrandId));
    }
  }, [activeBrandId, hasActiveBrandData, dispatch]);

  const handleCreateBrand = () => {
    const newBrand = {
      id: Date.now().toString(),
      name: "New Brand",
      description: "A freshly created brand profile",
    };
    dispatch(addBrand(newBrand));
    // dispatch(setActiveBrand(newBrand.id));
  };

  const handleSelectBrand = (brandId: string) => {
    console.log("2. handleSelectBrand called for brand ID:", brandId);
    dispatch(setActiveBrand(brandId));
  };

  const nonDefaultBrands = brands.filter((b) => !b.isDefault);

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await fetch("/api/brand-kit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create brand kit");

      const data = await res.json();
      console.log("✅ Brand kit created:", data);
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  const handleBrandKitSubmit = (formData: FormData) => {
    // Send FormData to API
    fetch("/api/brand-kit", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => console.log("Brand Kit created:", data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-700/30 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Brand Dashboard
              </h1>
              <p className="text-slate-300 mt-1 text-base">
                Manage your brand profiles and social media campaigns
              </p>
            </div>

            {/* Create Brand Button */}
            <button
              onClick={() => setOpen(true)}
              className="group relative overflow-hidden px-3 py-2 rounded-xl bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-500/30 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span className="font-thin">Create Brand Profile</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            icon={Globe}
            label="Total Brands"
            value={nonDefaultBrands.length}
            iconBgColor="bg-blue-500/20"
            iconColor="text-blue-400"
          />
          <StatsCard
            icon={Target}
            label="Active Campaigns"
            value="-"
            iconBgColor="bg-green-500/20"
            iconColor="text-green-400"
          />
          <StatsCard
            icon={BarChart3}
            label="Total Posts"
            value="-"
            iconBgColor="bg-purple-500/20"
            iconColor="text-purple-400"
          />
          <StatsCard
            icon={TrendingUp}
            label="Total Reach"
            value="-"
            iconBgColor="bg-amber-500/20"
            iconColor="text-amber-400"
          />
        </div>

        {/* Brand List Section */}
        <div>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Workspaces & Brands
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {nonDefaultBrands.length > 0
                  ? `${nonDefaultBrands.length} brand${
                      nonDefaultBrands.length !== 1 ? "s" : ""
                    } created`
                  : "Get started with your default workspace or create your first brand"}
              </p>
            </div>
          </div>

          {/* Brand List */}
          <div className="space-y-4">
            {brands.map((brand, index) => (
              <BrandListItem
                key={brand.id}
                brand={brand}
                isActive={activeBrandId === brand.id}
                onSelect={handleSelectBrand}
                colorIndex={index}
                onOpenBrandKit={handleOpenBrandKit}
              />
            ))}
          </div>

          {/* Empty State for Brands (shown below the default workspace) */}
          {nonDefaultBrands.length === 0 && (
            <div className="mt-8 p-8 rounded-xl border-2 border-dashed border-slate-700/50 bg-slate-800/20 text-center">
              <h3 className="text-lg font-semibold text-white mb-3">
                Create Your First Brand Profile
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                While you can use the default workspace above, creating a brand
                profile gives you access to specialized tools for social media
                campaigns and brand management.
              </p>
              <button
                onClick={handleCreateBrand}
                className="px-6 py-3 bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-amber-500/20"
              >
                Create Brand Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <BrandProfileDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      />
      <BrandKitDialog
        open={brandKitOpen}
        onOpenChange={setBrandKitOpen}
        onSubmit={handleBrandKitSubmit}
      />
    </div>
  );
}
