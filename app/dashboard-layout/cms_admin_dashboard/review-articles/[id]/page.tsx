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
  version_number: number;
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

      if (
        role !== "cms_admin" &&
        role !== "super_admin"
      ) {
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
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("review_comments")
      .insert({
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

  if (loading) {
    return (
      <main className="p-8">
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="p-8">
        <h1>Article not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() =>
            router.push(
              "/dashboard-layout/cms_admin_dashboard/review-articles"
            )
          }
          className="mb-6 text-blue-700"
        >
          ← Back
        </button>

        <div className="bg-white p-8 rounded-xl shadow">

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              {article.title}
            </h1>

            <span className="px-3 py-1 rounded-full bg-slate-100">
              {article.status}
            </span>
          </div>

          {article.subtitle && (
            <p className="mt-2 text-gray-500">
              {article.subtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-6">

            {article.status === "under_review" && (
              <>
                <button
                  onClick={() =>
                    updateStatus("changes_requested")
                  }
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                  Request Changes
                </button>

                <button
                  onClick={() =>
                    updateStatus("approved")
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus("rejected")
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </>
            )}

            {article.status === "approved" && (
              <button
                onClick={() =>
                  updateStatus("published")
                }
                className="bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Publish
              </button>
            )}
          </div>

          <div className="space-y-8 mt-8">

            <section>
              <h2 className="font-bold text-xl mb-2">
                Abstract
              </h2>
              <p>{article.abstract}</p>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-2">
                Keywords
              </h2>
              <p>{article.keywords}</p>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-2">
                Introduction
              </h2>
              <p>{article.introduction}</p>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-2">
                Methods
              </h2>
              <p>{article.methods}</p>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-2">
                Results
              </h2>
              <p>{article.results}</p>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-2">
                Discussion
              </h2>
              <p>{article.discussion}</p>
            </section>

            <section>
              <h2 className="font-bold text-xl mb-2">
                Conclusion
              </h2>
              <p>{article.conclusion}</p>
            </section>

          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Review Comments
          </h2>

          <textarea
            value={newComment}
            onChange={(e) =>
              setNewComment(e.target.value)
            }
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
              <div
                key={comment.id}
                className="border rounded-lg p-4"
              >
                <p>{comment.comment}</p>

                <p className="text-xs text-gray-500 mt-2">
                  {new Date(
                    comment.created_at
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Version History
          </h2>

          <div className="space-y-3">
            {versions.map((version) => (
              <div
                key={version.id}
                className="border rounded-lg p-4"
              >
                <div className="font-semibold">
                  Version {version.version_number}
                </div>

                <div className="text-sm text-gray-500">
                  {new Date(
                    version.created_at
                  ).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}