"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/auth";

type Article = {
  id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  abstract: string | null;
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

type ReviewComment = {
  id: number;
  comment: string;
  created_at: string;
};

type Version = {
  id: number;
  article_id: string;
  version_number: number;
  abstract: string | null;
  keywords: string | null;
  introduction: string | null;
  methods: string | null;
  results: string | null;
  discussion: string | null;
  conclusion: string | null;
  funding: string | null;
  ethics_statement: string | null;
  acknowledgements: string | null;
  reviewer_id: string | null;
  created_at: string;
};

export default function ReviewArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedVersionId, setExpandedVersionId] = useState<number | null>(null);

  const fetchData = async () => {
    const { data: articleData } = await supabase
      .from("research_articles")
      .select("*")
      .eq("id", articleId)
      .single();

    const { data: commentsData } = await supabase
      .from("review_comments")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: false });

    const { data: versionsData } = await supabase
      .from("article_versions")
      .select("*")
      .eq("article_id", articleId)
      .order("version_number", { ascending: false });

    setArticle(articleData);
    setComments(commentsData || []);
    setVersions(versionsData || []);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const role = await getCurrentUserRole();
      if (role !== "cms_admin" && role !== "super_admin") {
        router.push("/login");
        return;
      }
      await fetchData();
    };
    init();
  }, []);

  const updateStatus = async (status: string) => {
    const { error } = await supabase
      .from("research_articles")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", articleId);

    if (error) {
      alert(error.message);
      return;
    }
    alert(`Article moved to ${status}`);
    await fetchData();
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("review_comments").insert({
      article_id: articleId,
      reviewer_id: user?.id,
      comment: newComment,
    });

    if (error) {
      console.log("FULL ERROR:", error);
      alert(JSON.stringify(error, null, 2));
      return;
    }
    setNewComment("");
    fetchData();
  };

  const toggleVersion = (id: number) => {
    setExpandedVersionId((prev) => (prev === id ? null : id));
  };

  const versionSections = [
    { label: "Abstract", key: "abstract" },
    { label: "Keywords", key: "keywords" },
    { label: "Introduction", key: "introduction" },
    { label: "Methods", key: "methods" },
    { label: "Results", key: "results" },
    { label: "Discussion", key: "discussion" },
    { label: "Conclusion", key: "conclusion" },
    { label: "Funding", key: "funding" },
    { label: "Ethics Statement", key: "ethics_statement" },
    { label: "Acknowledgements", key: "acknowledgements" },
  ] as const;

  if (loading) {
    return <main className="p-8"><h1>Loading...</h1></main>;
  }

  if (!article) {
    return <main className="p-8"><h1>Article not found</h1></main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => router.push("/dashboard-layout/cms_admin_dashboard/review-articles")}
          className="mb-6 text-blue-700"
        >
          ← Back
        </button>

        {/* Article Content Card */}
        <div className="bg-white p-8 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-medium">
              {article.status}
            </span>
          </div>

          {article.subtitle && (
            <p className="mt-2 text-gray-500">{article.subtitle}</p>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            {article.status === "under_review" && (
              <>
                <button
                  onClick={() => updateStatus("changes_requested")}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                  Request Changes
                </button>
                <button
                  onClick={() => updateStatus("approved")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus("rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </>
            )}
            {article.status === "approved" && (
              <button
                onClick={() => updateStatus("published")}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Publish
              </button>
            )}
          </div>

          <div className="space-y-8 mt-8">
            {[
              { label: "Abstract", value: article.abstract },
              { label: "Keywords", value: article.keywords },
              { label: "Introduction", value: article.introduction },
              { label: "Methods", value: article.methods },
              { label: "Results", value: article.results },
              { label: "Discussion", value: article.discussion },
              { label: "Conclusion", value: article.conclusion },
            ].map(({ label, value }) => (
              <section key={label}>
                <h2 className="font-bold text-xl mb-2">{label}</h2>
                <p>{value}</p>
              </section>
            ))}
          </div>
        </div>

        {/* Review Comments Card */}
        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h2 className="text-2xl font-bold mb-4">Review Comments</h2>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="w-full border rounded-lg p-3"
            placeholder="Write review feedback..."
          />

          <button
            onClick={addComment}
            className="mt-3 bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Add Comment
          </button>

          <div className="space-y-3 mt-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <p>{comment.comment}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Version History Timeline */}
        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h2 className="text-2xl font-bold mb-6">Version History</h2>

          {versions.length === 0 ? (
            <p className="text-gray-400 text-sm">No versions recorded yet.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200" />

              <div className="space-y-4">
                {versions.map((version, index) => {
                  const isExpanded = expandedVersionId === version.id;
                  const isLatest = index === 0;

                  return (
                    <div key={version.id} className="relative pl-12">
                      <div
                        className={`absolute left-2.5 top-4 w-3 h-3 rounded-full border-2 ${
                          isLatest
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-slate-300"
                        }`}
                      />

                      <div className="border rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleVersion(version.id)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-800">
                              Version {version.version_number}
                            </span>
                            {isLatest && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                Latest
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">
                              {new Date(version.created_at).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <svg
                              className={`w-4 h-4 text-gray-400 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t px-5 py-5 bg-slate-50">
                            <div className="space-y-5">
                              {versionSections.map(({ label, key }) => {
                                const value = version[key];
                                if (!value) return null;
                                return (
                                  <div key={key}>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                      {label}
                                    </p>
                                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                      {value}
                                    </p>
                                  </div>
                                );
                              })}

                              {version.reviewer_id && (
                                <div className="pt-3 border-t">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                    Reviewer ID
                                  </p>
                                  <p className="text-slate-500 text-xs font-mono">
                                    {version.reviewer_id}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}