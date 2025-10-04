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
import {
  Plus,
  Globe,
  Target,
  BarChart3,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BrandListItem } from "@/components/dashboard/BrandListItem";
import { fetchCalendarDataByBrandId } from "@/store/feature/calendarSlice";
import BrandProfileDialog from "@/components/dashboard/CreateBrandProfileModal";
import BrandKitDialog from "@/components/dashboard/BrandKitDialog";
import {
  CreateBrandKit,
  CreateBrandProfile,
  GetBrandProfileJobStatus,
  getUserDetails,
} from "@/services/userServices";
import Image from "next/image";
import { toast } from "sonner";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [brandKitOpen, setBrandKitOpen] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isUserloading, setIsUserLoading] = useState(true);
  const handleOpenBrandKit = () => setBrandKitOpen(true);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { brands, activeBrandId } = useAppSelector(
    (state: RootState) => state.brand
  );
  const dispatch = useAppDispatch();

  const hasActiveBrandData = useAppSelector(
    (state: RootState) =>
      !!(activeBrandId && state.calendar.dataByBrand[activeBrandId])
  );

  useEffect(() => {
    // 1. Define an async function to fetch the data
    const fetchUserDetails = async () => {
      try {
        setIsUserLoading(true);
        const data = await getUserDetails(); // 2. await the promise to get the data
        setUserData(data); // 3. Set the data into state
        console.log("User details fetched:", data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        // Handle error state if needed
      } finally {
        setIsUserLoading(false);
      }
    };

    // 4. Call the function only when the user is authenticated
    if (user && isAuthenticated) {
      fetchUserDetails();
    } else {
      setIsUserLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (activeBrandId && !hasActiveBrandData) {
      dispatch(fetchCalendarDataByBrandId(activeBrandId));
    }
  }, [activeBrandId, hasActiveBrandData, dispatch]);

  const handleCreateBrandDummy = () => {
    const newBrand = {
      id: Date.now().toString(),
      name: "New Brand",
      description: "A freshly created brand profile",
    };
    dispatch(addBrand(newBrand));
    // dispatch(setActiveBrand(newBrand.id));
  };

  const handleCreateBrand = async (formData: FormData) => {
    try {
      const res = await CreateBrandProfile(formData);

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

      // start polling
      pollJobStatus(res.jobId, res.id.toString());
    } catch (error) {
      console.error("Error creating brand:", error);
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

          clearInterval(interval);
        } else if (jobRes.status === "failed") {
          console.error("❌ Brand creation failed for brand:", brandId);
          // The status is already set to 'failed' by the first dispatch.
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
        clearInterval(interval);
      }
    }, 10000); // Poll every 10 seconds
  };

  const handleSelectBrand = (brandId: string) => {
    console.log("2. handleSelectBrand called for brand ID:", brandId);
    dispatch(setActiveBrand(brandId));
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
      // console.log("Brand Kit created and stored in Redux:", newBrandKit);
      toast.success("Brand Kit created successfully!");
    } catch (err) {
      console.error(err);
      setIsloading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-700/30 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image src="/Logo4.png" alt="logo" width={36} height={32} />
              {/* <h1 className="text-2xl bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Dashboard
              </h1> */}
              <p className="text-white font-bold text-3xl">
                casspr
                <span className="font-thin tracking-wider">AIR</span>
              </p>
              {/* <p className="text-slate-300 mt-1 text-base">
                Manage your brand profiles and social media campaigns
              </p> */}
            </div>

            {/* Create Brand Button */}
            <button
              onClick={() => setOpen(true)}
              className="group relative overflow-hidden px-2 py-2 rounded-xl bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-500/30 flex items-center space-x-2"
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
            {nonDefaultBrands.map((brand, index) => (
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

          {/* Empty State for Brands (shown below the default workspace) */}
          {nonDefaultBrands.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-8 p-8 rounded-xl border-2 border-dashed border-slate-700/50 bg-slate-800/20 text-center">
              <h3 className="text-lg font-semibold text-white mb-3">
                Create Your First Brand Profile
              </h3>
              {/* <p className="text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                While you can use the default workspace above, creating a brand
                profile gives you access to specialized tools for social media
                campaigns and brand management.
              </p> */}
              <button
                onClick={handleCreateBrandDummy}
                className="px-6 py-3 bg-gradient-to-r from-[#E6A550] to-[#BC853B] hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-amber-500/20"
              >
                Create Brand Profile
              </button>
              {/* <button
                onClick={() => setOpen(true)}
                className="group relative overflow-hidden px-3 py-2 rounded-xl bg-gradient-to-r from-[#E6A550] to-[#BC853B] text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-amber-500/30 flex items-center space-x-2"
              >
                <Plus size={20} />
                <span className="font-thin">Create Brand Profile</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
              </button> */}
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
