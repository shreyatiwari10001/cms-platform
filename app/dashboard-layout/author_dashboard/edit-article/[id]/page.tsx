"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [articleFound, setArticleFound] = useState(true);
  const [status, setStatus] = useState("");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");

  const [introduction, setIntroduction] = useState("");
  const [methods, setMethods] = useState("");
  const [results, setResults] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [conclusion, setConclusion] = useState("");

  const [funding, setFunding] = useState("");
  const [ethicsStatement, setEthicsStatement] = useState("");
  const [acknowledgements, setAcknowledgements] = useState("");

  useEffect(() => {
    if (!articleId) return;

    const loadArticle = async () => {
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
          .eq("id", articleId)
          .eq("user_id", user.id)
          .single();

        if (error || !data) {
          setArticleFound(false);
          setLoading(false);
          return;
        }

        setStatus(data.status || "");

        setTitle(data.title || "");
        setSubtitle(data.subtitle || "");
        setAbstract(data.abstract || "");
        setKeywords(data.keywords || "");

        setIntroduction(data.introduction || "");
        setMethods(data.methods || "");
        setResults(data.results || "");
        setDiscussion(data.discussion || "");
        setConclusion(data.conclusion || "");

        setFunding(data.funding || "");
        setEthicsStatement(data.ethics_statement || "");
        setAcknowledgements(data.acknowledgements || "");
      } catch (err) {
        console.error(err);
        setArticleFound(false);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  const updateArticle = async () => {
    if (!title.trim()) {
      alert("Article title is required");
      return;
    }

    if (!abstract.trim()) {
      alert("Abstract is required");
      return;
    }

    setUpdating(true);

    try {
      const { error } = await supabase
        .from("research_articles")
        .update({
          title,
          subtitle,
          abstract,
          keywords,
          introduction,
          methods,
          results,
          discussion,
          conclusion,
          funding,
          ethics_statement: ethicsStatement,
          acknowledgements,
          updated_at: new Date().toISOString(),
        })
        .eq("id", articleId);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Article updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update article");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (!articleFound) {
    return (
     
        <div className="text-center py-10">
        <h2 className="text-xl font-semibold">
            No Articles Found
        </h2>

        <p className="text-gray-500 mt-2">
           You haven&apos;t created any articles yet.
        </p>

      <Link href="/dashboard-layout/author_dashboard/create-article">
      <button className="mt-4 bg-blue-700 text-white px-6 py-2 rounded-lg">
        Create New Article
      </button>
    </Link>
  </div>
    );
  }

  if (status === "pending") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4">
            Article Pending Review
          </h2>

          <p>
            This article is currently under review by the admin.
          </p>
        </div>
      </main>
    );
  }

  if (status === "approved") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Article Approved
          </h2>

          <p>
            This article has already been approved and cannot be edited.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Edit Article
        </h1>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Article Title"
            className="w-full p-3 border border-slate-300 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Subtitle"
            className="w-full p-3 border border-slate-300 rounded-lg"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <textarea
            placeholder="Abstract"
            className="w-full p-3 border border-slate-300 rounded-lg h-32"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          />

          <input
            type="text"
            placeholder="Keywords"
            className="w-full p-3 border border-slate-300 rounded-lg"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />

          <textarea
            placeholder="Introduction"
            className="w-full p-3 border border-slate-300 rounded-lg h-40"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
          />

          <textarea
            placeholder="Methods"
            className="w-full p-3 border border-slate-300 rounded-lg h-40"
            value={methods}
            onChange={(e) => setMethods(e.target.value)}
          />

          <textarea
            placeholder="Results"
            className="w-full p-3 border border-slate-300 rounded-lg h-40"
            value={results}
            onChange={(e) => setResults(e.target.value)}
          />

          <textarea
            placeholder="Discussion"
            className="w-full p-3 border border-slate-300 rounded-lg h-40"
            value={discussion}
            onChange={(e) => setDiscussion(e.target.value)}
          />

          <textarea
            placeholder="Conclusion"
            className="w-full p-3 border border-slate-300 rounded-lg h-40"
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
          />

          <textarea
            placeholder="Funding"
            className="w-full p-3 border border-slate-300 rounded-lg h-32"
            value={funding}
            onChange={(e) => setFunding(e.target.value)}
          />

          <textarea
            placeholder="Ethics Statement"
            className="w-full p-3 border border-slate-300 rounded-lg h-32"
            value={ethicsStatement}
            onChange={(e) => setEthicsStatement(e.target.value)}
          />

          <textarea
            placeholder="Acknowledgements"
            className="w-full p-3 border border-slate-300 rounded-lg h-32"
            value={acknowledgements}
            onChange={(e) => setAcknowledgements(e.target.value)}
          />

          <button
            onClick={updateArticle}
            disabled={updating}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Article"}
          </button>
        </div>
      </div>
    </main>
  );
}