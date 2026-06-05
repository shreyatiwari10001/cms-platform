"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const handleSaveProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("USER:", user);

    if (!user) {
      alert("Please login first");
      return;
    }

    const { data, error } = await supabase
      .from("author_profiles")
      .insert([
        {
          user_id: user.id,
          name,
          email,
          designation,
          affiliation,
          bio,
          profile_image: profileImage,
        },
      ])
      .select();

    console.log("DATA:", data);

    if (error) {
      console.log("ERROR:", error);
      alert(JSON.stringify(error, null, 2));
      return;
    }

    alert("Profile saved successfully!");
  };

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Author Profile
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-slate-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-slate-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Designation"
            className="w-full p-3 border border-slate-300 rounded-lg"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />

          <input
            type="text"
            placeholder="Affiliation"
            className="w-full p-3 border border-slate-300 rounded-lg"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
          />

          <textarea
            placeholder="Bio"
            className="w-full p-3 border border-slate-300 rounded-lg h-32"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <input
            type="text"
            placeholder="Profile Image URL"
            className="w-full p-3 border border-slate-300 rounded-lg"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
          />

          <button
            onClick={handleSaveProfile}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg"
          >
            Save Profile
          </button>
        </div>
      </div>
    </main>
  );
}