"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AuthorRequestPage() {
  const router = useRouter();
  const [qualification, setQualification] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(!!user);
    };

    checkUser();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Check if user already has a pending request
    const { data: existingRequest, error: checkError } = await supabase
      .from("author_requests")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .maybeSingle();

    if (checkError) {
      setLoading(false);
      alert(checkError.message);
      return;
    }

    if (existingRequest) {
      setLoading(false);
      alert("You already have a pending author request.");
      return;
    }

    const { error } = await supabase.from("author_requests").insert([
      {
        user_id: user.id,
        qualification,
        research_area: researchArea,
        reason,
        status: "pending",
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Author request submitted successfully!Please wait for admin approval.");
    router.push("/dashboard");
    <Link
  href="/dashboard-layout/dashboard"
  className="block text-center bg-blue-700 text-white p-3 rounded-lg"
>
  Back to Dashboard
</Link>

    setQualification("");
    setResearchArea("");
    setReason("");
  };

  if (isLoggedIn === null) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            Login Required
          </h1>

          <p className="text-slate-600 mb-6">
            You must be logged in to submit an author access request.
          </p>

          <Link
            href="/login"
            className="inline-block bg-blue-700 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-2">
          Author Access Request
        </h1>

        <p className="text-center text-slate-500 mb-6">
          Submit your details to become an author
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Qualification"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg"
          />

          <input
            type="text"
            placeholder="Research Area"
            value={researchArea}
            onChange={(e) => setResearchArea(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg"
          />

          <textarea
            placeholder="Why do you want author access?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg"
            rows={4}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit Request"}
          
          </button>
       
        </div>
      </div>
    </main>
  );
}