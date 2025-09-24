"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users2Icon, Mail, Globe, Instagram, Phone } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/redux-hooks";
import { toast } from "sonner";

// Define a type for our form data for better type safety
type ProfileFormData = {
  username: string;
  nickname: string;
  displayName: string;
  role: string;
  email: string;
  website: string;
  whatsapp: string;
  instagram: string;
  summary: string;
};

function ProfileForm() {
  const { user } = useAppSelector((state) => state.auth);

  // 1. STATE MANAGEMENT
  const [isEditing, setIsEditing] = useState(false);
  // State for the uploaded image file and its preview URL
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Central state object for all form fields
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    nickname: "",
    displayName: "",
    role: "User", // Default role
    email: "",
    website: "",
    whatsapp: "",
    instagram: "",
    summary: "",
  });

  // 2. DATA SYNCING
  // useEffect to populate the form with user data from Redux
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.name || "",
        nickname: user.name || "", // Default nickname to name
        displayName: user.name || "",
        role: "User", // Or a role from user object if it exists
        email: user.email || "",
        // Initialize other fields from user object if they exist, otherwise empty
        website: "",
        whatsapp: "",
        instagram: "",
        summary: "",
      });
      // Also reset image preview if user data changes
      setImagePreview(user.avatar_url || null);
    }
  }, [user]);

  // 3. HANDLER FUNCTIONS
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file); // Store the file object
      setImagePreview(URL.createObjectURL(file)); // Create and store the preview URL
    }
  };

  const handleCancel = () => {
    // Reset form data and image preview back to the original state from Redux
    if (user) {
      setFormData({
        username: user.name || "",
        nickname: user.name || "",
        displayName: user.name || "",
        role: "User",
        email: user.email || "",
        website: "",
        whatsapp: "",
        instagram: "",
        summary: "",
      });
      setImagePreview(user.avatar_url || null);
      setImageFile(null);
    }
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    // Here you would build your FormData and send it to your API
    const apiFormData = new FormData();
    apiFormData.append("profileData", JSON.stringify(formData));
    if (imageFile) {
      apiFormData.append("profileImage", imageFile);
    }

    console.log("Submitting the following data to the API:");
    for (let [key, value] of apiFormData.entries()) {
      console.log(`${key}:`, value);
    }

    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  // Helper array for mapping profile info fields
  const profileFields = [
    { key: "username", label: "Username" },
    { key: "nickname", label: "Nickname" },
    { key: "displayName", label: "Display Name" },
    { key: "role", label: "Role" },
  ];

  // Helper array for mapping contact info fields
  const contactFields = [
    { key: "email", label: "Email (required)", icon: Mail, type: "email" },
    { key: "website", label: "Website", icon: Globe, type: "text" },
    { key: "whatsapp", label: "Whatsapp", icon: Phone, type: "tel" },
    { key: "instagram", label: "Instagram", icon: Instagram, type: "text" },
  ];

  if (!user) return <div>Loading...</div>; // Add a loading state

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <Card className="border border-neutral-800 bg-neutral-900 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2Icon className="w-6 h-6 text-white" />
            <h2 className="font-semibold text-white">User Profile</h2>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-neutral-700 text-white hover:bg-neutral-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                className="bg-[var(--primary2)] hover:bg-[var(--primary2)] text-white"
              >
                Save
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              className="bg-[var(--primary2)] hover:bg-[var(--primary2)] text-white"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </CardHeader>
      </Card>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Sidebar - Account */}
        <Card className="w-full lg:w-1/3 border border-neutral-800 bg-neutral-900 shadow-md">
          <CardHeader>
            <h3 className="font-medium text-white">Account Management</h3>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border border-neutral-700">
                <Image
                  src={imagePreview || "/Profile.svg"}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              </div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-upload"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    variant="secondary"
                    className="mt-4 w-full bg-neutral-800 hover:bg-neutral-700 text-white"
                    onClick={() =>
                      document.getElementById("profile-upload")?.click()
                    }
                  >
                    Upload Photo
                  </Button>
                </>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="oldPassword" className="text-white">
                  Old Password
                </Label>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="Enter your old password"
                  disabled={!isEditing}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 disabled:opacity-70"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="newPassword" className="text-white">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  disabled={!isEditing}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 disabled:opacity-70"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Content - Profile Info */}
        <Card className="flex-1 border border-neutral-800 bg-neutral-900 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div className="space-y-4">
              <h3 className="font-medium text-white">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="text-white">{field.label}</Label>
                    <Input
                      name={field.key}
                      value={formData[field.key as keyof ProfileFormData]}
                      onChange={handleInputChange}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      disabled={!isEditing}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 disabled:opacity-70"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-neutral-700" />

            <div className="space-y-4">
              <h3 className="font-medium text-white">Contact Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contactFields.map((field) => (
                  <div key={field.key} className="flex flex-col space-y-2">
                    <Label className="text-white">{field.label}</Label>
                    <div className="flex items-center">
                      <field.icon className="w-4 h-4 mr-2 text-white" />
                      <Input
                        name={field.key}
                        type={field.type}
                        value={formData[field.key as keyof ProfileFormData]}
                        onChange={handleInputChange}
                        placeholder={`Enter your ${field.label
                          .split(" ")[0]
                          .toLowerCase()}`}
                        disabled={!isEditing}
                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 disabled:opacity-70"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-neutral-700" />

            <div className="space-y-2">
              <h3 className="font-medium text-white">About the User</h3>
              <Label className="text-white">Summary</Label>
              <Textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Write something about yourself..."
                disabled={!isEditing}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 disabled:opacity-70"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfileForm;
