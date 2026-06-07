"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AuthorProfile = {
  name: string;
  email: string;
  designation: string;
  affiliation: string;
  bio: string;
  profile_image: string;
};

export default function ViewProfilePage() {
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

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">
            My Profile
          </h1>

          <button
            onClick={() =>
              router.push("/dashboard-layout/author_dashboard/profile")
            }
            className="bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        </div>

        <div className="flex items-center gap-6 mb-8">
          {profile?.profile_image ? (
            <img
              src={profile.profile_image}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-700">
              {(profile?.name || userEmail || "A")
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <strong>Name:</strong>{" "}
            {profile?.name || "Not Provided"}
          </div>

          <div>
            <strong>Email:</strong>{" "}
            {profile?.email || userEmail}
          </div>

          <div>
            <strong>Designation:</strong>{" "}
            {profile?.designation || "Not Provided"}
          </div>

          <div>
            <strong>Affiliation:</strong>{" "}
            {profile?.affiliation || "Not Provided"}
          </div>

          <div>
            <strong>Bio:</strong>{" "}
            {profile?.bio || "Not Provided"}
          </div>
        </div>
      </div>
    </main>
  );
}