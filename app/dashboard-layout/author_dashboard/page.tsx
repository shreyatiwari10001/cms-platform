"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type StatCard = {
  label: string;
  value: string;
  icon: string;
};

export default function AuthorDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<StatCard[]>([
    { label: "Submitted", value: "0", icon: "📤" },
    { label: "Under Review", value: "0", icon: "🔍" },
    { label: "Published", value: "0", icon: "✅" },
    { label: "Rejected", value: "0", icon: "❌" },
  ]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const role = await getCurrentUserRole();

        if (role !== "author") {
          router.push("/login");
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }
        // 🔥 PROFILE CHECK
        const { data: profile, error: profileError } = await supabase
        .from("author_profiles")
        .select("name, designation, affiliation, bio")
        .eq("user_id", user.id)
        .maybeSingle();

        if (profileError) {
        console.error(profileError);
        }

        // define completeness
      const isProfileComplete =
        profile?.name &&
        profile?.designation &&
        profile?.affiliation &&
        profile?.bio;

        if (!isProfileComplete) {
          alert("⚠️ Please complete your profile first");

        router.push("/dashboard-layout/author_dashboard/profile");
        return;
      }

        const { data: articles, error } = await supabase
          .from("research_articles")
          .select("status")
          .eq("user_id", user.id);

        if (error) {
          console.error(error);
        }

        const submitted =
          articles?.filter(
            (article) => article.status === "submitted"
          ).length || 0;

        const underReview =
          articles?.filter(
            (article) => article.status === "under_review"
          ).length || 0;

        const published =
          articles?.filter(
            (article) => article.status === "published"
          ).length || 0;

        const rejected =
          articles?.filter(
            (article) => article.status === "rejected"
          ).length || 0;

        setStats([
          {
            label: "Submitted",
            value: submitted.toString(),
            icon: "📤",
          },
          {
            label: "Under Review",
            value: underReview.toString(),
            icon: "🔍",
          },
          {
            label: "Published",
            value: published.toString(),
            icon: "✅",
          },
          {
            label: "Rejected",
            value: rejected.toString(),
            icon: "❌",
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const workflow = [
    { step: "1", label: "Submit your article", bg: "bg-blue-600" },
    { step: "2", label: "Editorial review", bg: "bg-amber-500" },
    { step: "3", label: "Revisions (if needed)", bg: "bg-yellow-800" },
    { step: "4", label: "Published live", bg: "bg-green-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef2fb]">
        <p className="text-sm text-blue-300 animate-pulse">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef2fb] p-6 font-sans">
      <h1
        className="text-5xl font-bold text-[#1a2e6e] mb-5"
        style={{ fontFamily: "'Lora', serif" }}
      >
        Author Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {stats.map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5 border border-blue-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-s font-semibold tracking-widest text-blue-600 uppercase">
                {label}
              </p>

              <span className="text-2xl">{icon}</span>
            </div>

            <p
              className="text-4xl font-bold text-[#1a2e6e]"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Welcome + Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="bg-white rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-xl bg-[#eef2fb] flex items-center justify-center flex-shrink-0">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a2e6e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>

            <div>
              <p className="text-2xl font-bold text-[#1a2e6e] mb-1">
                Welcome, Author
              </p>

              <p className="text-m text-blue-600 leading-relaxed">
                Submit new articles for review or manage your
                existing submissions.
              </p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href="/dashboard-layout/author_dashboard/create-article">
              <button className="bg-[#2563eb] hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full">
                + Submit Article
              </button>
            </Link>

            <Link href="/dashboard-layout/author_dashboard/my-articles">
              <button className="bg-[#eef2fb] hover:bg-blue-100 text-[#1a2e6e] text-sm font-medium px-5 py-2.5 rounded-full border border-blue-100">
                My Articles
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-blue-100">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-5">
            Article Workflow
          </p>

          <ol className="flex flex-col gap-4 list-none">
            {workflow.map(({ step, label, bg }) => (
              <li key={step} className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${bg}`}
                >
                  {step}
                </span>

                <span className="text-sm font-medium text-[#1a2e6e]">
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      

        
      </div>
    
  );
}