"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/auth";

export default function CreateArticlePage() {
  const router = useRouter();
  const [checkingAccess, setCheckingAccess] = useState(true);

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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const role = await getCurrentUserRole();
      if (role !== "author") {
        alert("Access denied. Only approved authors can create articles.");
        router.push("/dashboard-layout/dashboard");
        return;
      }
      setCheckingAccess(false);
    };
    checkRole();
  }, [router]);

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert("Article title is required");
      return;
    }
    if (!abstract.trim()) {
      alert("Abstract is required");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
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
      setSaving(false);
      alert(error.message);
      return;
    }

    setSaving(false);
    alert("Draft saved successfully!");
  };

  if (checkingAccess) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Checking access...</p>
      </main>
    );
  }

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
            disabled={saving}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </div>
    </main>
  );
}