"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/auth";

type AuthorRequest = {
  id: number;
  user_id: string;
  qualification: string;
  research_area: string;
  reason: string;
  status: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
};

export default function AuthorRequestsPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<AuthorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("author_requests")
      .select(`
        *,
        profiles (
          email,
          full_name
        )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (!error && data) {
      setRequests(data as AuthorRequest[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const initializePage = async () => {
      const role = await getCurrentUserRole();

      if (role !== "cms_admin" && role !== "super_admin") {
        router.push("/login");
        return;
      }

      setCheckingAccess(false);
      await fetchRequests();
    };

    initializePage();
  }, [router]);

  const approveRequest = async (
    requestId: number,
    userId: string
  ) => {
    const response = await fetch("/api/approve-author", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, userId }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert("Error: " + result.error);
      return;
    }

    alert("✅ Request approved aur role updated!");
    fetchRequests();
  };

  const rejectRequest = async (requestId: number) => {
    const { error } = await supabase
      .from("author_requests")
      .update({ status: "rejected" })
      .eq("id", requestId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Request rejected");
    fetchRequests();
  };

  if (checkingAccess) {
    return (
      <main className="p-8">
        <h1>Checking permissions...</h1>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-8">
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Author Requests
        </h1>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <p className="text-gray-500">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl p-6 shadow border"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-bold text-lg text-blue-900">
                      Request #{request.id}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      📧 {request.profiles?.email}
                    </p>
                    {request.profiles?.full_name && (
                      <p className="text-sm text-gray-600">
                        👤 {request.profiles.full_name}
                      </p>
                    )}
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                    Pending
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p>
                    <strong>Qualification:</strong>{" "}
                    {request.qualification}
                  </p>
                  <p>
                    <strong>Research Area:</strong>{" "}
                    {request.research_area}
                  </p>
                  <p>
                    <strong>Reason:</strong>
                  </p>
                  <p className="text-gray-700">{request.reason}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      approveRequest(request.id, request.user_id)
                    }
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectRequest(request.id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}