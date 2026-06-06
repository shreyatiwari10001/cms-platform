"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [totalArticles, setTotalArticles] = useState(0);
  const [draftArticles, setDraftArticles] = useState(0);
  const [latestArticle, setLatestArticle] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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

    const articles = data || [];

    setTotalArticles(articles.length);

    setDraftArticles(
      articles.filter(
        (article) => article.status === "draft"
      ).length
    );

    if (articles.length > 0) {
      setLatestArticle(articles[0]);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">
          Dashboard
        </h1>

        {/* Quick Navigation */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Quick Navigation
          </h2>

          <div className="flex flex-wrap gap-3">
            <Link href="/profile">
              <button className="bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 rounded-lg">
                Profile
              </button>
            </Link>

            <Link href="/create-article">
              <button className="bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-lg">
                Create Article
              </button>
            </Link>

            <Link href="/my-articles">
              <button className="bg-purple-700 hover:bg-purple-600 text-white px-5 py-2 rounded-lg">
                My Articles
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-slate-700">
              Total Articles
            </h2>

            <p className="text-4xl font-bold text-blue-700 mt-3">
              {totalArticles}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-slate-700">
              Draft Articles
            </h2>

            <p className="text-4xl font-bold text-blue-700 mt-3">
              {draftArticles}
            </p>
          </div>
        </div>

        {/* Latest Article */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Latest Article
          </h2>

          {latestArticle ? (
            <>
              <p className="text-lg font-medium">
                {latestArticle.title}
              </p>

              <p className="text-slate-600 mt-2">
                Status: {latestArticle.status}
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Created:{" "}
                {new Date(
                  latestArticle.created_at
                ).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-slate-500">
              No articles available.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}