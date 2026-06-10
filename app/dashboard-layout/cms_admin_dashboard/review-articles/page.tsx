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

export default function ReviewArticlesPage() {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("research_articles")
      .select("*")
      .not("status", "eq", "draft")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      setArticles(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const role = await getCurrentUserRole();

      if (
        role !== "cms_admin" &&
        role !== "super_admin"
      ) {
        router.push("/login");
        return;
      }

      setCheckingAccess(false);
      await fetchArticles();
    };

    init();
  }, [router]);

  const updateStatus = async (
    id: string,
    newStatus: string
  ) => {
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

    if (newStatus === "changes_requested") {
      alert("📝 Changes requested from author");
    } else if (newStatus === "approved") {
      alert("✅ Article approved");
    } else if (newStatus === "published") {
      alert("🎉 Article published");
    } else if (newStatus === "rejected") {
      alert("❌ Article rejected");
    }

    fetchArticles();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "under_review":
        return "bg-yellow-100 text-yellow-700";

      case "changes_requested":
        return "bg-orange-100 text-orange-700";

      case "approved":
        return "bg-blue-100 text-blue-700";

      case "published":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">
            Review Articles
          </h1>

          <button
            onClick={fetchArticles}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <p className="text-gray-500">
              No articles available for review
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
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
                      <p className="text-gray-500 mt-1">
                        {article.subtitle}
                      </p>
                    )}

                    <div className="mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          article.status
                        )}`}
                      >
                        {article.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Created:{" "}
                      {new Date(
                        article.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
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

                    {article.status === "under_review" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(
                              article.id,
                              "changes_requested"
                            )
                          }
                          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg"
                        >
                          Request Changes
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              article.id,
                              "approved"
                            )
                          }
                          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              article.id,
                              "rejected"
                            )
                          }
                          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {article.status === "approved" && (
                      <button
                        onClick={() =>
                          updateStatus(
                            article.id,
                            "published"
                          )
                        }
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