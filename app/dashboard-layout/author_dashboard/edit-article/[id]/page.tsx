"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import RichTextEditor from "@/components/RichTextEditor";

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
  const [comments, setComments] = useState<Array<{ id: string; comment: string; created_at: string }>>([]);

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

        const { data: commentsData } = await supabase
          .from("review_comments")
          .select("*")
          .eq("article_id", articleId)
          .order("created_at", { ascending: false });

        setComments(commentsData || []);
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

  const resubmitArticle = async () => {
    setUpdating(true);

    try {
      const { error } = await supabase
        .from("research_articles")
        .update({
          status: "under_review",
          updated_at: new Date().toISOString(),
        })
        .eq("id", articleId);

      if (error) {
        alert(error.message);
        return;
      }

      const { data: latestVersion } = await supabase
        .from("article_versions")
        .select("version_number")
        .eq("article_id", articleId)
        .order("version_number", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextVersion = (latestVersion?.version_number || 0) + 1;

      await supabase.from("article_versions").insert({
        article_id: articleId,
        version_number: nextVersion,
      });

      alert("✅ Article resubmitted for review");
      setStatus("under_review");
    } catch (err) {
      console.error(err);
      alert("Failed to resubmit article");
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
    );
  }

  if (status === "under_review") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4">
            Under Review
          </h2>
          <p>Your article is currently being reviewed by CMS Admin.</p>
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
          <p>This article has already been approved and cannot be edited.</p>
        </div>
      </main>
    );
  }

  if (status === "published") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Published
          </h2>
          <p>Your article has been published.</p>
        </div>
      </main>
    );
  }

  if (status === "rejected") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Rejected</h2>
          <p>Your article was rejected by the CMS Admin.</p>
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

        {/* Review Comments */}
        {comments.length > 0 && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">
              Review Comments
            </h2>
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white border rounded-lg p-4"
                >
                  <p>{comment.comment}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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
            <RichTextEditor content={abstract} onChange={setAbstract} />
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
            <RichTextEditor content={introduction} onChange={setIntroduction} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Methods
            </label>
            <RichTextEditor content={methods} onChange={setMethods} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Results
            </label>
            <RichTextEditor content={results} onChange={setResults} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Discussion
            </label>
            <RichTextEditor content={discussion} onChange={setDiscussion} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Conclusion
            </label>
            <RichTextEditor content={conclusion} onChange={setConclusion} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Funding
            </label>
            <RichTextEditor content={funding} onChange={setFunding} />
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

          <div className="flex gap-4">
            <button
              onClick={updateArticle}
              disabled={updating}
              className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update Article"}
            </button>

            {status === "changes_requested" && (
              <button
                onClick={resubmitArticle}
                disabled={updating}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg"
              >
                Resubmit For Review
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}