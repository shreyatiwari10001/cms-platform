"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthorRequestPage() {
  const [qualification, setQualification] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
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

    if (error) {
      alert(error.message);
      return;
    }

    alert("Author request submitted successfully!");

    setQualification("");
    setResearchArea("");
    setReason("");
  };

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
            className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Submit Request
          </button>
        </div>
      </div>
    </main>
  );
}