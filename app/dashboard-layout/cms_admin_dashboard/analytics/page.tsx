"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";
import {
  Users,
  UserPlus,
  FileText,
  FileEdit,
  Send,
  CheckCircle2,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnalyticsSummary {
  totalAuthors: number;
  pendingAuthorRequests: number;
  totalArticles: number;
  draftArticles: number;
  submittedArticles: number;
  publishedArticles: number;
  pendingReviews: number;
}

interface MonthlySubmission {
  month: string; // e.g. "Jan", "Feb"
  submissions: number;
}

interface AnalyticsResponse {
  summary: AnalyticsSummary;
  monthlySubmissions: MonthlySubmission[];
}

// ---------------------------------------------------------------------------
// Static config for the metric cards
// ---------------------------------------------------------------------------

const METRIC_CARDS: {
  key: keyof AnalyticsSummary;
  label: string;
  icon: React.ElementType;
  accent: string; // tailwind classes for icon background + text
}[] = [
  {
    key: "totalAuthors",
    label: "Total Authors",
    icon: Users,
    accent: "bg-blue-100 text-blue-700",
  },
  {
    key: "pendingAuthorRequests",
    label: "Pending Author Requests",
    icon: UserPlus,
    accent: "bg-amber-100 text-amber-700",
  },
  {
    key: "totalArticles",
    label: "Total Articles",
    icon: FileText,
    accent: "bg-indigo-100 text-indigo-700",
  },
  {
    key: "draftArticles",
    label: "Draft Articles",
    icon: FileEdit,
    accent: "bg-slate-200 text-slate-700",
  },
  {
    key: "submittedArticles",
    label: "Submitted Articles",
    icon: Send,
    accent: "bg-purple-100 text-purple-700",
  },
  {
    key: "publishedArticles",
    label: "Published Articles",
    icon: CheckCircle2,
    accent: "bg-green-100 text-green-700",
  },
  {
    key: "pendingReviews",
    label: "Pending Reviews",
    icon: ClipboardList,
    accent: "bg-rose-100 text-rose-700",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminAnalyticsDashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  // -- Access control ---------------------------------------------------
  useEffect(() => {
    const checkAccess = async () => {
      const role = await getCurrentUserRole();

      if (role !== "cms_admin" && role !== "super_admin") {
        router.push("/login");
        return;
      }

      setAuthChecked(true);
    };

    checkAccess();
  }, [router]);

  // -- Data fetch ---------------------------------------------------------
  useEffect(() => {
    if (!authChecked) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/analytics", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json: AnalyticsResponse = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError("Couldn't load analytics. Try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [authChecked]);

  // -- Render guards --------------------------------------------------------
  if (!authChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-blue-50">
        <h1 className="text-blue-900 font-medium">Loading...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard-layout/cms_admin_dashboard"
              className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <h1 className="text-3xl font-bold text-blue-900">
              Admin Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Operational overview of authors, articles, and review activity.
            </p>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Metric cards */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRIC_CARDS.map(({ key, label, icon: Icon, accent }) => (
            <div
              key={key}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2.5 ${accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-slate-500">
                  {label}
                </span>
              </div>

              <div className="mt-4 text-3xl font-bold text-blue-900">
                {loading || !data ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
                ) : (
                  data.summary[key].toLocaleString()
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Monthly content submissions chart */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-blue-900">
              Monthly Content Submissions
            </h2>
            <p className="text-sm text-slate-500">
              Number of articles submitted for review each month.
            </p>
          </div>

          {loading || !data ? (
            <div className="h-72 w-full animate-pulse rounded-xl bg-slate-100" />
          ) : data.monthlySubmissions.length === 0 ? (
            <div className="flex h-72 items-center justify-center text-sm text-slate-400">
              No submission data yet.
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlySubmissions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#eff6ff" }}
                    contentStyle={{
                      borderRadius: "0.75rem",
                      borderColor: "#bfdbfe",
                    }}
                  />
                  <Bar
                    dataKey="submissions"
                    fill="#1d4ed8"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}