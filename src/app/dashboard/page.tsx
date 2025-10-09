"use client";
import React, { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import {
  setActiveBrand,
  addBrand,
  updateBrandStatus,
  updateBrandId,
  BrandKit,
  updateBrandKits,
} from "@/store/feature/brandSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { Plus, Globe, Target, BarChart3, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BrandListItem } from "@/components/dashboard/BrandListItem";
import { fetchCalendarDataByBrandId } from "@/store/feature/calendarSlice";
import BrandProfileDialog from "@/components/dashboard/CreateBrandProfileModal";
import BrandKitDialog from "@/components/dashboard/BrandKitDialog";
import {
  CreateBrandKit,
  CreateBrandProfile,
  GetBrandProfileJobStatus,
} from "@/services/userServices";
import Image from "next/image";
import { toast } from "sonner";
import {
  fetchCalendarForBrand,
  fetchUserBrands,
} from "@/store/thunks/brandThunks";
import { BrandListItemSkeleton } from "@/components/dashboard/skelton/BrandListItemSkeleton";
import OverlayLoader from "@/components/dashboard/skelton/OverlayLoader";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [brandKitOpen, setBrandKitOpen] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [isCreatingBrand, setIsCreatingBrand] = useState(false); // New state for overlay loader
  const handleOpenBrandKit = () => setBrandKitOpen(true);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    brands,
    activeBrandId,
    loading: isBrandDataloading,
  } = useAppSelector((state: RootState) => state.brand);
  const dispatch = useAppDispatch();

  const hasActiveBrandData = useAppSelector(
    (state: RootState) =>
      !!(activeBrandId && state.calendar.dataByBrand[activeBrandId])
  );

  useEffect(() => {
    if (activeBrandId && !hasActiveBrandData) {
      dispatch(fetchCalendarDataByBrandId(activeBrandId));
    }
  }, [activeBrandId, hasActiveBrandData, dispatch]);

  // const handleCreateBrandDummy = () => {
  //   const newBrand = {
  //     id: Date.now().toString(),
  //     name: "New Brand",
  //     description: "A freshly created brand profile",
  //   };
  //   dispatch(addBrand(newBrand));
  //   // dispatch(setActiveBrand(newBrand.id));
  // };

  const handleCreateBrand = async (formData: FormData) => {
    try {
      setIsCreatingBrand(true); // Show overlay loader
      const res = await CreateBrandProfile(formData);
      setIsCreatingBrand(false); // Hide overlay loader after API call completes

      const newBrand = {
        id: res.id.toString(), // API ID
        name: "New Brand", // placeholder
        description: `Job queued (${res.jobId})`,
        createdAt: res.created_at,
        jobId: res.jobId,
        profileId: res.profileId ?? null,
        status: res.data.status, // queued
      };

      dispatch(addBrand(newBrand));
      toast.success("Brand profile creation started!");

      // start polling (loader won't show during this)
      pollJobStatus(res.jobId, res.id.toString());
    } catch (error) {
      console.error("Error creating brand:", error);
      setIsCreatingBrand(false); // Hide loader on error
      toast.error("Failed to create brand profile");
    }
  };

  const pollJobStatus = (jobId: string, brandId: string) => {
    const interval = setInterval(async () => {
      try {
        const jobRes = await GetBrandProfileJobStatus(jobId);

        // This first dispatch keeps the UI updated for "running" status
        dispatch(
          updateBrandStatus({
            id: brandId, // Always use the original ID to find the item
            status: jobRes.status,
            profileId: jobRes.brand_profile_id ?? null,
          })
        );

        if (jobRes.status === "complete" && jobRes.brand_profile_id) {
          console.log(
            "✅ Brand created successfully with profileId:",
            jobRes.brand_profile_id
          );

          // When complete, dispatch a final update to replace the temporary ID
          // with the permanent one from the server.
          dispatch(
            updateBrandId({
              tempId: brandId, // The ID to find
              finalId: jobRes.brand_profile_id, // The new ID to set
              profileId: jobRes.brand_profile_id,
            })
          );

          toast.success("Brand profile created successfully!");
          clearInterval(interval);
        } else if (jobRes.status === "failed") {
          console.error("❌ Brand creation failed for brand:", brandId);
          toast.error("Brand profile creation failed");
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error checking job status:", error);
        dispatch(
          updateBrandStatus({
            id: brandId,
            status: "failed",
            profileId: null,
          })
        );
        toast.error("Error checking brand status");
        clearInterval(interval);
      }
    }, 10000); // Poll every 10 seconds
  };

  const handleSelectBrand = (brandId: string) => {
    // Immediately set the brand as active for a responsive UI
    dispatch(setActiveBrand(brandId));

    // Find the full brand object from the current state
    const targetBrand = brands.find((b) => b.id === brandId);

    // CORE LOGIC: Check if the brand exists, is not the default,
    // and its calendarData hasn't been fetched yet.
    if (targetBrand && !targetBrand.isDefault && !targetBrand.calendarData) {
      console.log(
        `Calendar data for "${targetBrand.name}" not found. Fetching...`
      );
      // Dispatch the thunk to fetch and set the calendar data
      dispatch(fetchCalendarForBrand(targetBrand));
    }
  };

  const nonDefaultBrands = brands.filter((b) => !b.isDefault);

  const handleBrandKitSubmit = async (formData: FormData) => {
    try {
      setIsloading(true);
      const result = await CreateBrandKit(formData);

      const newBrandKit: BrandKit = {
        id: result.kitData._id,
        name: result.kitData.brand_name,
        assets: [
          result.kitData.assets.logo_path,
          result.kitData.assets.mascot_path,
          ...(result.kitData.assets.additional_images || []),
        ],
        createdAt: result.kitData.created_date,
        kitData: result.kitData, // store full kitData
        userId: result.userId,
        brandProfileId: result.brandProfileId,
        created_at: result.created_at,
        updated_at: result.updated_at,
      };

      const profileId = result.brandProfileId;

      // Replace old kit with the new one (only one kit per brand)
      dispatch(updateBrandKits({ profileId, brandKit: newBrandKit }));
      setIsloading(false);
      toast.success("Brand Kit created successfully!");
    } catch (err) {
      console.error(err);
      setIsloading(false);
      toast.error("Failed to create brand kit");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Overlay Loader - Shows only during brand creation API call */}
      {isCreatingBrand && <OverlayLoader />}

      {/* Header */}
      <div className="border-b border-slate-700/30 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Image src="/Logo2.png" alt="logo" width={180} height={32} />
              {/* <p className="text-white font-bold text-3xl">
                casspr
                <span className="font-thin tracking-wider">AIR</span>
              </p> */}
            </div>

            {/* Create Brand Button */}
            <button
              onClick={() => setOpen(true)}
              className="group relative overflow-hidden px-2 py-2 rounded-xl bg-white text-black font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center space-x-2"
            >
              <Plus size={20} />
              <span className="font-thin">Create Brand Profile</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                Brand Library
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
            {isBrandDataloading ? (
              // show 3 skeletons while loading
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <BrandListItemSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {brands.map((brand, index) => (
                  <BrandListItem
                    key={brand.id}
                    brand={brand}
                    isActive={activeBrandId === brand.id}
                    onSelect={handleSelectBrand}
                    colorIndex={index}
                    onOpenBrandKit={handleOpenBrandKit}
                    isLoading={isloading}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Empty State for Brands (shown below the default workspace) */}
          {nonDefaultBrands.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-8 p-8 rounded-xl border-2 border-dashed border-slate-700/50 bg-slate-800/20 text-center">
              <h3 className="text-lg font-semibold text-white mb-3">
                Create Your First Brand Profile
              </h3>
            </div>
          )}
        </div>
      </div>
      <BrandProfileDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleCreateBrand}
      />
      <BrandKitDialog
        open={brandKitOpen}
        onOpenChange={setBrandKitOpen}
        onSubmit={handleBrandKitSubmit}
        isloading={isloading}
      />
    </div>
  );
}
