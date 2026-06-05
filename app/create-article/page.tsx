"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateArticlePage() {
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

  const handleSaveDraft = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const { error } = await supabase.from("research_articles").insert([
      {
        user_id: user.id,
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
        status: "draft",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Draft saved successfully!");
  };

  return (
    <main className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Create Research Article
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
            placeholder="Keywords (comma separated)"
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
            onClick={handleSaveDraft}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg"
          >
            Save Draft
          </button>
        </div>
      </div>
    </main>
  );
}