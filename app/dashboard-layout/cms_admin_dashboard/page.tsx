"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";

export default function CMSAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const role = await getCurrentUserRole();

      if (role !== "cms_admin" && role !== "super_admin") {
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    checkAccess();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          CMS Admin Dashboard
        </h1>

        <div className="space-y-3">
          <Link
            href="/dashboard-layout/cms_admin_dashboard/author_request"
            className="block bg-blue-700 text-white p-3 rounded-lg text-center"
          >
            Manage Writer Requests
          </Link>

          <Link
            href="/dashboard-layout/cms_admin_dashboard/review-articles"
            className="block bg-green-600 text-white p-3 rounded-lg text-center"
          >
            Review Articles
          </Link>

          <Link
            href="/manage_user"
            className="block bg-slate-100 p-3 rounded-lg text-center"
          >
            Manage Users
          </Link>
          <button
  onClick={() => router.push("/dashboard-layout/cms_admin_dashboard/review-articles")}
  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
>
  Manage Articles
</button>
        </div>
      </div>
    </main>
  );
}