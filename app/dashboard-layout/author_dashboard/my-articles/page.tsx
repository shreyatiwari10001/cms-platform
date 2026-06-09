"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "published"
    | "rejected";
  created_at: string;
  updated_at: string | null;
};

export default function MyArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("research_articles")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error(error);
          alert(error.message);
          return;
        }

        setArticles((data as Article[]) || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load articles");
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  const deleteArticle = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("research_articles")
        .delete()
        .eq("id", id);

      if (error) {
        alert(error.message);
        return;
      }

      setArticles((prev) => prev.filter((article) => article.id !== id));
      alert("Article deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete article");
    }
  };

  const submitArticle = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to submit this article for review?"
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("research_articles")
        .update({
          status: "submitted",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        alert(error.message);
        return;
      }

      // UI mein bhi update karo
      setArticles((prev) =>
        prev.map((article) =>
          article.id === id
            ? { ...article, status: "submitted" }
            : article
        )
      );

      alert("✅ Article submitted for review!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit article");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "under_review":
        return "bg-yellow-100 text-yellow-700";
      case "published":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-lg text-blue-900">Loading articles...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">
            My Articles
          </h1>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold">No Articles Found</h2>
            <p className="text-gray-500 mt-2">
              You haven&apos;t created any articles yet.
            </p>
            <Link href="/dashboard-layout/author_dashboard/create-article">
              <button className="mt-4 bg-blue-700 text-white px-6 py-2 rounded-lg">
                Create New Article
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition"
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

                    <div className="mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          article.status
                        )}`}
                      >
                        {article.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                      Created:{" "}
                      {new Date(article.created_at).toLocaleString()}
                    </p>

                    {article.updated_at && (
                      <p className="text-sm text-gray-500 mt-1">
                        Updated:{" "}
                        {new Date(article.updated_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {/* Edit — sirf draft pe */}
                    {article.status === "draft" && (
                      <Link
                        href={`/dashboard-layout/author_dashboard/edit-article/${article.id}`}
                      >
                        <button className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                          Edit
                        </button>
                      </Link>
                    )}

                    {/* Submit — sirf draft pe */}
                    {article.status === "draft" && (
                      <button
                        onClick={() => submitArticle(article.id)}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
                      >
                        Submit
                      </button>
                    )}

                    {/* Delete — sirf draft pe */}
                    {article.status === "draft" && (
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
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