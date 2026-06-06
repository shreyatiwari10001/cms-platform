"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function MyArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
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
      setLoading(false);
      return;
    }

    setArticles(data || []);
    setLoading(false);
  };

  const deleteArticle = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this draft?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("research_articles")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Draft deleted successfully!");
    fetchArticles();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-50 p-8">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          My Articles
        </h1>

        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border border-slate-300 rounded-lg p-5"
              >
                <h2 className="text-xl font-semibold">
                  {article.title}
                </h2>

                <p className="text-gray-600 mt-2">
                  Status: {article.status}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Created:{" "}
                  {new Date(article.created_at).toLocaleString()}
                </p>

                {article.updated_at && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last Updated:{" "}
                    {new Date(article.updated_at).toLocaleString()}
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <Link href={`/edit-articles/${article.id}`}>
                    <button className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}