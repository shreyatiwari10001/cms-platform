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

                <Link href={`/edit-articles/${article.id}`}>
                  <button className="mt-4 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Edit
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}