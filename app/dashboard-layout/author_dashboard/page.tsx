"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";

export default function AuthorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const role = await getCurrentUserRole();
      if (role !== "author") {
        router.push("/login");
        return;
      }
      setLoading(false);
    };
    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <main className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin text-blue-700" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          <p className="text-sm text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  const stats = [
    { label: "Submitted", value: "0", emoji: "📤", color: "text-blue-600" },
    { label: "Under Review", value: "0", emoji: "🔍", color: "text-amber-500" },
    { label: "Published", value: "0", emoji: "✅", color: "text-emerald-600" },
    { label: "Rejected", value: "0", emoji: "❌", color: "text-red-500" },
  ];

  return (
    <main className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 flex flex-col font-sans">

      {/* Top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur border-b border-indigo-100">
        <div>
          <h1 className="text-xl font-bold text-blue-900 tracking-tight">Author Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Home / Author Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl border border-indigo-100 bg-white flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-400 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
        </div>
      </header>

      <div className="flex-1 px-8 py-8 flex flex-col gap-7 max-w-5xl w-full mx-auto">

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/80 backdrop-blur rounded-2xl p-5 flex items-center gap-4 border border-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {s.emoji}
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-extrabold leading-none ${s.color}`}>{s.value}</span>
                <span className="text-xs text-gray-400 mt-1 font-medium">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          {/* Actions card — 2 cols */}
          <div className="md:col-span-2 bg-white/90 backdrop-blur rounded-2xl p-8 border border-white shadow-sm flex flex-col gap-7">
            <div className="flex gap-5 items-start">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900 tracking-tight mb-2">Welcome, Author</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Submit new articles for review or manage your existing submissions. Your content goes through editorial review before publishing.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/submit-article"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Submit Article
              </Link>
              <Link
                href="/my-articles"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 text-sm font-medium px-5 py-3 rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-all bg-white"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                My Articles
              </Link>
            </div>
          </div>

          {/* Workflow panel */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-blue-900">Article Workflow</h3>
            <ol className="flex flex-col gap-3">
              {[
                { step: "1", label: "Submit your article", color: "from-blue-900 to-blue-600" },
                { step: "2", label: "Editorial review", color: "from-amber-500 to-amber-400" },
                { step: "3", label: "Revisions (if needed)", color: "from-indigo-600 to-indigo-400" },
                { step: "4", label: "Published live", color: "from-emerald-600 to-emerald-400" },
              ].map((item) => (
                <li key={item.step} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                    {item.step}
                  </span>
                  {item.label}
                </li>
              ))}
            </ol>
            <div className="pt-3 border-t border-gray-100 flex gap-2 items-start text-xs text-gray-400 leading-relaxed">
              <svg className="mt-0.5 flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Reviews typically take 2–5 business days.
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}