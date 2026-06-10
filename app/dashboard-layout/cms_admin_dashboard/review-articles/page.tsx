"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/auth";

type Article = {
  id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  abstract: string;
  status: string;
  created_at: string;
  updated_at: string | null;
};

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Under Review", value: "under_review" },
  { label: "Changes Requested", value: "changes_requested" },
  { label: "Approved", value: "approved" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-yellow-100 text-yellow-700",
  changes_requested: "bg-orange-100 text-orange-700",
  approved: "bg-indigo-100 text-indigo-700",
  published: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ReviewArticlesPage() {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const fetchArticles = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("research_articles")
      .select("*")
      .not("status", "eq", "draft")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setArticles(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const role = await getCurrentUserRole();

      if (role !== "cms_admin" && role !== "super_admin") {
        router.push("/login");
        return;
      }

      setCheckingAccess(false);
      await fetchArticles();
    };

    init();
  }, [router]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("research_articles")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchArticles();
  };

  // Stats calculate karo
  const stats = {
    submitted: articles.filter((a) => a.status === "submitted").length,
    under_review: articles.filter((a) => a.status === "under_review").length,
    changes_requested: articles.filter((a) => a.status === "changes_requested").length,
    approved: articles.filter((a) => a.status === "approved").length,
    published: articles.filter((a) => a.status === "published").length,
    rejected: articles.filter((a) => a.status === "rejected").length,
  };

  // Filter articles by active tab
  const filteredArticles =
    activeTab === "all"
      ? articles
      : articles.filter((a) => a.status === activeTab);

  if (checkingAccess) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Checking permissions...</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading articles...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">
            Review Dashboard
          </h1>
          <button
            onClick={fetchArticles}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 shadow text-center border-t-4 border-blue-500">
            <p className="text-2xl font-bold text-blue-700">{stats.submitted}</p>
            <p className="text-xs text-gray-500 mt-1">Submitted</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center border-t-4 border-yellow-500">
            <p className="text-2xl font-bold text-yellow-700">{stats.under_review}</p>
            <p className="text-xs text-gray-500 mt-1">Under Review</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center border-t-4 border-orange-500">
            <p className="text-2xl font-bold text-orange-700">{stats.changes_requested}</p>
            <p className="text-xs text-gray-500 mt-1">Changes Requested</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center border-t-4 border-indigo-500">
            <p className="text-2xl font-bold text-indigo-700">{stats.approved}</p>
            <p className="text-xs text-gray-500 mt-1">Approved</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center border-t-4 border-green-500">
            <p className="text-2xl font-bold text-green-700">{stats.published}</p>
            <p className="text-xs text-gray-500 mt-1">Published</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center border-t-4 border-red-500">
            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
            <p className="text-xs text-gray-500 mt-1">Rejected</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab.value
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-600 hover:bg-blue-50 border"
              }`}
            >
              {tab.label}
              {tab.value !== "all" && (
                <span className="ml-1 text-xs">
                  ({articles.filter((a) => a.status === tab.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <p className="text-gray-500">No articles in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl p-6 shadow border"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      {article.title}
                    </h2>

                    {article.subtitle && (
                      <p className="text-gray-500 mt-1">{article.subtitle}</p>
                    )}

                    <div className="mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[article.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {article.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Submitted: {new Date(article.created_at).toLocaleString()}
                    </p>

                    {article.updated_at && (
                      <p className="text-sm text-gray-500">
                        Updated: {new Date(article.updated_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {/* View button — hamesha */}
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard-layout/cms_admin_dashboard/review-articles/${article.id}`
                        )
                      }
                      className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </button>

                    {/* Start Review */}
                    {article.status === "submitted" && (
                      <button
                        onClick={() => updateStatus(article.id, "under_review")}
                        className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg"
                      >
                        Start Review
                      </button>
                    )}

                    {/* Under Review actions */}
                    {article.status === "under_review" && (
                      <>
                        <button
                          onClick={() => updateStatus(article.id, "changes_requested")}
                          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg"
                        >
                          Request Changes
                        </button>
                        <button
                          onClick={() => updateStatus(article.id, "approved")}
                          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(article.id, "rejected")}
                          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {/* Publish */}
                    {article.status === "approved" && (
                      <button
                        onClick={() => updateStatus(article.id, "published")}
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}