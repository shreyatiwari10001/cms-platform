"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/auth";
import RichTextEditor from "@/components/RichTextEditor";

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
    router.push("/dashboard-layout/author_dashboard/my-articles");
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
        <div className="space-y-6">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Article Title *
            </label>
            <input
              type="text"
              placeholder="Article Title"
              className="w-full p-3 border border-slate-300 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              placeholder="Subtitle"
              className="w-full p-3 border border-slate-300 rounded-lg"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Abstract *
            </label>
            <RichTextEditor
              content={abstract}
              onChange={setAbstract}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Keywords
            </label>
            <input
              type="text"
              placeholder="Keywords (comma separated)"
              className="w-full p-3 border border-slate-300 rounded-lg"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Introduction
            </label>
            <RichTextEditor
              content={introduction}
              onChange={setIntroduction}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Methods
            </label>
            <RichTextEditor
              content={methods}
              onChange={setMethods}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Results
            </label>
            <RichTextEditor
              content={results}
              onChange={setResults}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Discussion
            </label>
            <RichTextEditor
              content={discussion}
              onChange={setDiscussion}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Conclusion
            </label>
            <RichTextEditor
              content={conclusion}
              onChange={setConclusion}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Funding
            </label>
            <RichTextEditor
              content={funding}
              onChange={setFunding}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Ethics Statement
            </label>
            <RichTextEditor
              content={ethicsStatement}
              onChange={setEthicsStatement}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Acknowledgements
            </label>
            <RichTextEditor
              content={acknowledgements}
              onChange={setAcknowledgements}
            />
          </div>

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