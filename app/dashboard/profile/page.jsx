"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await apiCall("/current_user");
      if (response) {
        // Handle plain text response like "test11 2" (username id)
        let userData = {};
        if (typeof response === "string") {
          const parts = response.split(" ");
          userData = {
            name: parts[0],
            username: parts[0],
            id: parts[1],
          };
        } else {
          userData = response;
        }

        setUser(userData);
        setFormData({
          name: userData.name || userData.username || "",
          email: userData.email || "",
          bio: userData.bio || "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Update endpoint - adjust based on your backend API
      const response = await apiCall("/current_user", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (response) {
        setUser(response);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-[32px] font-semibold text-slate-900 tracking-tight mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          User Profile
        </h1>
        <p className="text-[14px] text-slate-500 font-light">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl">
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-200">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[32px] font-semibold mb-4">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h2 className="text-[24px] font-semibold text-slate-900">
              {user?.name || "User"}
            </h2>
            <p className="text-[14px] text-slate-500 mt-1">
              {user?.email || "No email"}
            </p>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all"
                />
              ) : (
                <p className="text-[16px] text-slate-900 font-medium">
                  {user?.name || "Not set"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all"
                />
              ) : (
                <p className="text-[16px] text-slate-900 font-medium">
                  {user?.email || "Not set"}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all resize-none"
                />
              ) : (
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  {user?.bio || "No bio added yet"}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3 pt-8 border-t border-slate-200">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || "",
                      email: user?.email || "",
                      bio: user?.bio || "",
                    });
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-[14px] font-medium hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all active:scale-[0.98]"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Account Status
            </p>
            <p className="text-[16px] font-medium text-slate-900">Active</p>
            <p className="text-[12px] text-slate-500 mt-1">
              Your account is in good standing
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Member Since
            </p>
            <p className="text-[16px] font-medium text-slate-900">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-[12px] text-slate-500 mt-1">Join date</p>
          </div>
        </div>
      </div>
    </div>
  );
}
