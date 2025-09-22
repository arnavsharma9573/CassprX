"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users2Icon, Mail, Globe, Instagram, Phone } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

function ProfileForm() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
    }
  };

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
                onClick={() => setIsEditing(false)}
                className="border-neutral-700 text-white hover:bg-neutral-800"
              >
                Cancel
              </Button>
              <Button onClick={() => setIsEditing(false)} className="bg-[var(--primary2)] hover:bg-[var(--primary2)] text-white">Save</Button>
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
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative w-54 h-54 rounded-full overflow-hidden border border-neutral-700">
                <Image
                  src={profileImage || "/Profile.svg"}
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

            {/* Password Fields */}
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
            {/* Profile Info */}
            <div className="space-y-4">
              <h3 className="font-medium text-white">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Username", "Nickname", "Display Name", "Role"].map(
                  (field) => (
                    <div key={field} className="space-y-2">
                      <Label className="text-white">{field}</Label>
                      <Input
                        placeholder={`Enter your ${field.toLowerCase()}`}
                        disabled={!isEditing}
                        className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 disabled:opacity-70"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <Separator className="bg-neutral-700" />

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-medium text-white">Contact Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label className="text-white">Email (required)</Label>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-white" />
                    <Input
                      placeholder="Enter your email"
                      disabled={!isEditing}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 disabled:opacity-70"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label className="text-white">Website</Label>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-white" />
                    <Input
                      placeholder="Enter your website"
                      disabled={!isEditing}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 disabled:opacity-70"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label className="text-white">Whatsapp</Label>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-white" />
                    <Input
                      placeholder="Enter your WhatsApp number"
                      disabled={!isEditing}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 disabled:opacity-70"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label className="text-white">Instagram</Label>
                  <div className="flex items-center">
                    <Instagram className="w-4 h-4 mr-2 text-white" />
                    <Input
                      placeholder="Enter your Instagram handle"
                      disabled={!isEditing}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400 disabled:opacity-70"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-neutral-700" />

            {/* About */}
            <div className="space-y-2">
              <h3 className="font-medium text-white">About the User</h3>
              <Label className="text-white">Summary</Label>
              <Textarea
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
