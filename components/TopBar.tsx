"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type AuthorProfile = {
  user_id: string;
  name: string;
  email: string;
  designation: string;
  affiliation: string;
  bio: string;
  profile_image: string;
};

export default function TopBar() {
  const router = useRouter();

  const [profile, setProfile] = useState<AuthorProfile | null>(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserEmail(user.email || "");

      const { data } = await supabase
        .from("author_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-blue-100">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-[#1a2e6e] hover:text-[#2563eb]"
      >
        <span className="w-8 h-8 rounded-full bg-[#f0f4ff] flex items-center justify-center">
          ←
        </span>
        Back
      </button>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Profile Button */}
        <button
          onClick={() => router.push("/dashboard-layout/author_dashboard/view-profile")}
          className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
        >
          {profile?.profile_image ? (
            <img
              src={profile.profile_image}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
              {(profile?.name || userEmail || "A")
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div className="text-left">
            <p className="font-semibold text-[#1a2e6e]">
              {profile?.name || "My Profile"}
            </p>
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full"
        >
          <span>↪</span>
          Logout
        </button>
      </div>
    </div>
  );
}