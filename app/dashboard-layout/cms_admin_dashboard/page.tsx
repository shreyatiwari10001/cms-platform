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

      if (role !== "cms_admin") {
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
            href="/admin/author_request"
            className="block bg-blue-700 text-white p-3 rounded-lg text-center"
          >
            Manage Writer Requests
          </Link>

          <Link
            href="/manage_user"
            className="block bg-slate-100 p-3 rounded-lg text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </main>
  );
}