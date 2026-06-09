"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const benefits = [
    "Create and publish articles",
    "Access the rich content editor",
    "Manage your own drafts",
    "Collaborate with editors & publishers",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Role check
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      setRole(profile?.role || null);

      // Latest author request status
      const { data: request } = await supabase
        .from("author_requests")
        .select("status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setRequestStatus(request?.status || null);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#eef2fb] p-6 font-sans">
      <h1
        className="text-5xl font-bold text-[#1a2e6e] mb-5"
        style={{ fontFamily: "'Lora', serif" }}
      >
        Dashboard
      </h1>

      {/* ✅ Request Status Banner */}
      {requestStatus === "pending" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-5 flex items-center gap-4">
          <span className="text-3xl">⏳</span>
          <div>
            <p className="font-semibold text-yellow-800">Request Pending</p>
            <p className="text-yellow-700 text-sm">
              Your author access request is under review. Please wait for admin approval.
            </p>
          </div>
        </div>
      )}

      {requestStatus === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-5 flex items-center gap-4">
          <span className="text-3xl">❌</span>
          <div>
            <p className="font-semibold text-red-800">Request Rejected</p>
            <p className="text-red-700 text-sm">
              Your author access request was rejected. You may submit a new request with updated details.
            </p>
            <Link href="/author_request">
              <button className="mt-2 bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg">
                Submit New Request
              </button>
            </Link>
          </div>
        </div>
      )}

      {role === "author" && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5 flex items-center gap-4">
          <span className="text-3xl">✅</span>
          <div>
            <p className="font-semibold text-green-800">Author Access Approved!</p>
            <p className="text-green-700 text-sm mb-2">
              Congratulations! You can now create and publish articles.
            </p>
            <Link href="/dashboard-layout/author_dashboard">
              <button className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-1.5 rounded-lg">
                Go to Author Dashboard →
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Welcome banner */}
      <div className="relative bg-[#1a2e6e] rounded-2xl p-8 mb-5 overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute right-24 bottom-0 w-48 h-48 rounded-full bg-[#2563eb]/40 translate-y-1/2 pointer-events-none" />
        <div className="relative z-10">
          <h2
            className="text-white text-3xl font-bold mb-2"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Welcome to CMS Platform
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-md mb-6">
            You&apos;re currently a{" "}
            <span className="text-white font-semibold">User</span>. Request
            author access to start creating and publishing content.
          </p>
          {!requestStatus && role !== "author" && (
            <Link href="/author_request">
              <button className="bg-[#2563eb] hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors shadow-md">
                + Request Author Access
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Benefits + access row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-2xl p-6 border border-blue-100">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-5">
            Author Benefits
          </p>
          <ul className="flex flex-col gap-4 list-none">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  ✓
                </span>
                <span className="text-sm font-medium text-[#1a2e6e]">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-blue-100 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-5">
              Current Access
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#eef2fb] flex items-center justify-center text-xl">
                🔒
              </div>
              <div>
                <p className="text-sm font-bold text-[#1a2e6e]">User</p>
                <p className="text-xs text-blue-400">Read-only access</p>
              </div>
            </div>
            <p className="text-sm text-blue-400 leading-relaxed">
              Upgrade to Author to unlock content creation, drafts, and
              publishing tools.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-blue-50 flex items-center gap-2">
            <span className="text-base">🗓️</span>
            <p className="text-xs text-blue-500">
              Requests reviewed by admins within 24–48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}