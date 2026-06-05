"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(true);

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
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from("research_articles")
      .select("*")
      .eq("id", articleId)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
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
    }

    setLoading(false);
  };

  const updateArticle = async () => {
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
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
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
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg"
          >
            Update Article
          </button>
        </div>
      </div>
    </main>
  );
}