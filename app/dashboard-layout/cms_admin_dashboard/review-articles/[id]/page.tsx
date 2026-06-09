"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/auth";

type Article = {
  id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  abstract: string;
  keywords: string | null;
  introduction: string | null;
  methods: string | null;
  results: string | null;
  discussion: string | null;
  conclusion: string | null;
  funding: string | null;
  ethics_statement: string | null;
  acknowledgements: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
};

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const role = await getCurrentUserRole();

      if (role !== "cms_admin" && role !== "super_admin") {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("research_articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error || !data) {
        alert("Article not found");
        router.push("/dashboard-layout/cms_admin_dashboard/review-articles");
        return;
      }

      setArticle(data);
      setLoading(false);
    };

    init();
  }, [articleId, router]);

  const updateStatus = async (newStatus: string) => {
    const { error } = await supabase
      .from("research_articles")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", articleId);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      newStatus === "under_review"
        ? "✅ Article moved to Under Review"
        : newStatus === "published"
        ? "✅ Article Published!"
        : "❌ Article Rejected"
    );

    router.push("/dashboard-layout/cms_admin_dashboard/review-articles");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-100 text-blue-700";
      case "under_review": return "bg-yellow-100 text-yellow-700";
      case "published": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!article) return null;

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard-layout/cms_admin_dashboard/review-articles")}
          className="mb-6 text-blue-700 hover:underline flex items-center gap-1"
        >
          ← Back to Review Articles
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="text-gray-500 mt-1">{article.subtitle}</p>
              )}
              <span className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                {article.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap mb-8 pb-6 border-b border-slate-200">
            {(article.status === "submitted" || article.status === "under_review") && (
              <>
                {article.status === "submitted" && (
                  <button
                    onClick={() => updateStatus("under_review")}
                    className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2 rounded-lg"
                  >
                    Start Review
                  </button>
                )}
                <button
                  onClick={() => updateStatus("published")}
                  className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg"
                >
                  Publish
                </button>
                <button
                  onClick={() => updateStatus("rejected")}
                  className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg"
                >
                  Reject
                </button>
              </>
            )}
          </div>

          {/* Article content */}
          <div className="space-y-6">
            {article.abstract && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Abstract</h2>
                <p className="text-slate-700 leading-relaxed">{article.abstract}</p>
              </div>
            )}
            {article.keywords && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Keywords</h2>
                <p className="text-slate-700">{article.keywords}</p>
              </div>
            )}
            {article.introduction && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Introduction</h2>
                <p className="text-slate-700 leading-relaxed">{article.introduction}</p>
              </div>
            )}
            {article.methods && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Methods</h2>
                <p className="text-slate-700 leading-relaxed">{article.methods}</p>
              </div>
            )}
            {article.results && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Results</h2>
                <p className="text-slate-700 leading-relaxed">{article.results}</p>
              </div>
            )}
            {article.discussion && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Discussion</h2>
                <p className="text-slate-700 leading-relaxed">{article.discussion}</p>
              </div>
            )}
            {article.conclusion && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Conclusion</h2>
                <p className="text-slate-700 leading-relaxed">{article.conclusion}</p>
              </div>
            )}
            {article.funding && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Funding</h2>
                <p className="text-slate-700">{article.funding}</p>
              </div>
            )}
            {article.ethics_statement && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Ethics Statement</h2>
                <p className="text-slate-700">{article.ethics_statement}</p>
              </div>
            )}
            {article.acknowledgements && (
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Acknowledgements</h2>
                <p className="text-slate-700">{article.acknowledgements}</p>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-gray-500">
            <p>Submitted: {new Date(article.created_at).toLocaleString()}</p>
            {article.updated_at && (
              <p>Last Updated: {new Date(article.updated_at).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}