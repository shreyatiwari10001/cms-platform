"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("Logged in user:", user);

    if (!user) {
      setLoading(false);
      alert("User not found");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    console.log("User ID:", user.id);
    console.log("Profile:", profile);
    console.log("Profile Error:", profileError);

    if (!profile) {
      alert("Profile not found");
      setLoading(false);
      return;
    }

    

    switch (profile?.role) {
  case "author":
    router.push("/dashboard-layout/author_dashboard");
    break;

  case "editor_approver":
    router.push("/dashboard-layout/editor_dashboard");
    break;

  case "publisher":
    router.push("/dashboard-layout/publisher_dashboard");
    break;

  case "cms_admin":
    router.push("/dashboard-layout/cms_admin_dashboard");
    break;

  case "super_admin":
    router.push("/dashboard-layout/super_admin_dashboard");
    break;

  default:
    router.push("/dashboard-layout/dashboard");
}

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-blue-100 p-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">
            CMS Platform
          </h1>

          <p className="text-blue-600 italic mt-2">
            Research Publishing System
          </p>

          <p className="text-slate-500 mt-4">
            Sign in to your account
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </div>

        <p className="text-center mt-6 text-slate-500">
          Don&apos;t have an account?
          <Link
            href="/register"
            className="text-blue-700 font-medium hover:underline ml-1"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}