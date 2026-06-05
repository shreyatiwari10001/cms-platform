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
};

export default function AuthorRequestsPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<AuthorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("author_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (!error && data) {
      setRequests(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    const initializePage = async () => {
      const role = await getCurrentUserRole();

      if (
        role !== "cms_admin" &&
        role !== "super_admin"
      ) {
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
    const { error: requestError } = await supabase
      .from("author_requests")
      .update({ status: "approved" })
      .eq("id", requestId);

    if (requestError) {
      alert(requestError.message);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "author" })
      .eq("id", userId);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("Request approved");

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
          <div className="bg-white rounded-xl p-6 shadow">
            No pending requests
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl p-6 shadow border"
              >
                <h2 className="font-bold text-lg">
                  Request #{request.id}
                </h2>

                <p className="mt-2">
                  <strong>Qualification:</strong>{" "}
                  {request.qualification}
                </p>

                <p>
                  <strong>Research Area:</strong>{" "}
                  {request.research_area}
                </p>

                <p className="mt-2">
                  <strong>Reason:</strong>
                </p>

                <p>{request.reason}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      approveRequest(
                        request.id,
                        request.user_id
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      rejectRequest(request.id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
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