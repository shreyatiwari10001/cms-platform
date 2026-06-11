"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";

type CMSContent = {
  id: string;
  content_type: string;
  title: string;
  slug: string;
  status: string;
  category: string | null;
  created_at: string;
  updated_at: string | null;
};

const CONTENT_TYPES = ["all", "blog", "news", "event", "faq", "campaign", "testimonials"];

const TYPE_COLORS: Record<string, string> = {
  blog: "bg-purple-100 text-purple-700",
  news: "bg-blue-100 text-blue-700",
  event: "bg-green-100 text-green-700",
  faq: "bg-yellow-100 text-yellow-700",
  campaign: "bg-pink-100 text-pink-700",
  testimonials: "bg-orange-100 text-orange-700",
};

export default function CMSContentPage() {
  const router = useRouter();
  const [contents, setContents] = useState<CMSContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");

  useEffect(() => {
    const init = async () => {
      const role = await getCurrentUserRole();
      if (role !== "cms_admin" && role !== "super_admin") {
        router.push("/login");
        return;
      }
      await fetchContents();
    };
    init();
  }, [router]);

  const fetchContents = async () => {
    setLoading(true);
    const response = await fetch("/api/get-content");
    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
    } else {
      setContents(result.data || []);
    }
    setLoading(false);
  };

  const deleteContent = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this content?"
    );
    if (!confirmed) return;

    const response = await fetch("/api/delete-content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
      return;
    }

    fetchContents();
  };

  const stats: Record<string, number> = {
    blog: contents.filter((c) => c.content_type === "blog").length,
    news: contents.filter((c) => c.content_type === "news").length,
    event: contents.filter((c) => c.content_type === "event").length,
    faq: contents.filter((c) => c.content_type === "faq").length,
    campaign: contents.filter((c) => c.content_type === "campaign").length,
    testimonials: contents.filter((c) => c.content_type === "testimonials").length,
  };

  const filtered =
    activeType === "all"
      ? contents
      : contents.filter((c) => c.content_type === activeType);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">CMS Content</h1>
          <button
            onClick={() =>
              router.push("/dashboard-layout/cms_admin_dashboard/content/create")
            }
            className="bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            + Create Content
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {Object.entries(stats).map(([type, count]) => (
            <div
              key={type}
              className="bg-white rounded-xl p-4 shadow text-center border-t-4"
              style={{
                borderColor:
                  type === "blog" ? "#9333ea" :
                  type === "news" ? "#3b82f6" :
                  type === "event" ? "#22c55e" :
                  type === "faq" ? "#eab308" :
                  type === "campaign" ? "#ec4899" : "#f97316",
              }}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{type}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${
                activeType === type
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-600 hover:bg-blue-50 border"
              }`}
            >
              {type}
              {type !== "all" && (
                <span className="ml-1 text-xs">
                  ({contents.filter((c) => c.content_type === type).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow text-center">
            <p className="text-gray-500">No content found</p>
            <button
              onClick={() =>
                router.push(
                  "/dashboard-layout/cms_admin_dashboard/content/create"
                )
              }
              className="mt-4 bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              + Create Content
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((content) => (
              <div
                key={content.id}
                className="bg-white rounded-xl p-6 shadow border"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          TYPE_COLORS[content.content_type] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {content.content_type}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          content.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {content.status}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-slate-800">
                      {content.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      /{content.slug}
                    </p>

                    {content.category && (
                      <p className="text-sm text-gray-500">
                        Category: {content.category}
                      </p>
                    )}

                    <p className="text-sm text-gray-400 mt-2">
                      Created: {new Date(content.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard-layout/cms_admin_dashboard/content/${content.id}`
                        )
                      }
                      className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteContent(content.id)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
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