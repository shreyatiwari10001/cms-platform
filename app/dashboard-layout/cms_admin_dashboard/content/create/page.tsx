"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";

const CONTENT_TYPES = ["blog", "news", "event", "faq", "campaign", "testimonials"];

export default function CreateContentPage() {
  const router = useRouter();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [contentType, setContentType] = useState("blog");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");

  useEffect(() => {
    const init = async () => {
      const role = await getCurrentUserRole();
      if (role !== "cms_admin" && role !== "super_admin") {
        router.push("/login");
        return;
      }
      setCheckingAccess(false);
    };
    init();
  }, [router]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setSlug(generatedSlug);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 5MB check
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    setUploading(false);

    if (!response.ok) {
      alert("Upload failed: " + result.error);
      return;
    }

    setFeaturedImage(result.url);
    alert("✅ Image uploaded successfully!");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!slug.trim()) {
      alert("Slug is required");
      return;
    }
    if (!content.trim()) {
      alert("Content is required");
      return;
    }

    setSaving(true);

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const response = await fetch("/api/create-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content_type: contentType,
        title,
        slug,
        content,
        featured_image: featuredImage || null,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        category: category || null,
        status,
      }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      alert("Error: " + result.error);
      return;
    }

    alert("✅ Content saved successfully!");
    router.push("/dashboard-layout/cms_admin_dashboard/content");
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
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() =>
              router.push("/dashboard-layout/cms_admin_dashboard/content")
            }
            className="text-blue-700 hover:underline"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-blue-900">
            Create Content
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">

          {/* Content Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Content Type
            </label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setContentType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                    contentType === type
                      ? "bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter title"
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
              className="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              URL: /{contentType}/{slug}
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              rows={10}
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Health, Technology"
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
            <p className="text-xs text-gray-400 mt-1">
              Comma se alag karo
            </p>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Featured Image
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full p-3 border border-slate-300 rounded-lg"
              />
              {uploading && (
                <p className="text-sm text-blue-600">Uploading...</p>
              )}
              {featuredImage && (
                <div>
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full max-h-48 object-cover rounded-lg mt-2"
                  />
                  <p className="text-xs text-gray-400 mt-1 break-all">
                    {featuredImage}
                  </p>
                  <button
                    onClick={() => setFeaturedImage("")}
                    className="mt-2 text-red-500 text-sm hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">
              SEO Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SEO optimized title"
                  className="w-full p-3 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Meta description for search engines"
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Status
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setStatus("draft")}
                className={`px-5 py-2 rounded-lg font-medium transition ${
                  status === "draft"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Draft
              </button>
              <button
                onClick={() => setStatus("published")}
                className={`px-5 py-2 rounded-lg font-medium transition ${
                  status === "published"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Published
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="w-full bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Content"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}