"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { getCurrentUserRole } from "@/lib/auth";
import Link from "next/link";

type Role = "user" | "author" | "cms_admin";

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}

const ROLES: Role[] = ["user", "author", "cms_admin"];

const ROLE_STYLES: Record<Role, string> = {
  user:      "bg-blue-50 text-blue-700 border border-blue-200",
  author:    "bg-purple-50 text-purple-700 border border-purple-200",
  cms_admin: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ManageUsersPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked]         = useState(false);
  const [users, setUsers]                     = useState<UserRow[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState<string | null>(null);
  const [updatingId, setUpdatingId]           = useState<string | null>(null);
  const [deletingId, setDeletingId]           = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [search, setSearch]                   = useState("");
  const [filterRole, setFilterRole]           = useState<Role | "all">("all");

  // Auth check
  useEffect(() => {
    const checkAccess = async () => {
      const role = await getCurrentUserRole();
      if (role !== "cms_admin" && role !== "super_admin") {
        router.push("/login");
        return;
      }
      setAuthChecked(true);
    };
    checkAccess();
  }, [router]);

  // Fetch users — useCallback so it's declared before the useEffect that calls it
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("profiles")           // ← change to your actual table name
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Failed to load users. Check your table name and RLS policies.");
    } else {
      setUsers(data as UserRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    void (async () => {
      await fetchUsers();
    })();
  }, [authChecked, fetchUsers]);

  // Change role
  async function handleRoleChange(userId: string, newRole: Role) {
    setUpdatingId(userId);
    const { error } = await supabase
      .from("profiles")           // ← change to your actual table name
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      alert("Failed to update role: " + error.message);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
    setUpdatingId(null);
  }

  // Delete user
  async function handleDelete(userId: string) {
    setDeletingId(userId);
    const { error } = await supabase
      .from("profiles")           // ← change to your actual table name
      .delete()
      .eq("id", userId);

    if (error) {
      alert("Failed to delete user: " + error.message);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  }

  // Filtered list
  const filtered = users.filter((u) => {
    const matchesSearch =
      (u.email?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (u.full_name?.toLowerCase() ?? "").includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!authChecked) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#dce8f8]">
        <p className="text-sm text-blue-700 animate-pulse">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#dce8f8] px-6 py-10 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard-layout/cms_admin_dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 mb-4 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to dashboard
          </Link>
          <h1 className="text-4xl font-bold text-blue-900 mb-1">Manage Users</h1>
          <p className="text-base text-blue-700/70">
            View, change roles, or remove users from the platform.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {ROLES.map((role) => {
            const count = users.filter((u) => u.role === role).length;
            const styles = {
              user:      { card: "bg-blue-50",    text: "text-blue-800",    num: "text-blue-900" },
              author:    { card: "bg-purple-50",  text: "text-purple-800",  num: "text-purple-900" },
              cms_admin: { card: "bg-emerald-50", text: "text-emerald-800", num: "text-emerald-900" },
            }[role];
            return (
              <div
                key={role}
                className={`rounded-2xl border-2 border-white shadow-md px-5 py-4 flex items-center justify-between ${styles.card}`}
              >
                <span className={`text-sm font-semibold ${styles.text}`}>
                  {role === "cms_admin" ? "CMS Admins" : role.charAt(0).toUpperCase() + role.slice(1) + "s"}
                </span>
                <span className={`text-3xl font-bold ${styles.num}`}>{count}</span>
              </div>
            );
          })}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-white bg-white shadow-sm text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as Role | "all")}
            className="px-4 py-2.5 rounded-xl border-2 border-white bg-white shadow-sm text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="all">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r === "cms_admin" ? "CMS Admin" : r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border-2 border-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                <circle cx="9" cy="7" r="4" />
                <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">

                    {/* User info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm shrink-0">
  {(user.full_name?.trim()?.[0] ||
    user.email?.trim()?.[0] ||
    "?").toUpperCase()}
</div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-tight">
                            {user.full_name ?? "—"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role dropdown */}
                    <td className="px-5 py-4">
                      <div className="relative inline-block">
                        <select
                          value={user.role}
                          disabled={updatingId === user.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                          className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60 ${ROLE_STYLES[user.role]}`}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r === "cms_admin" ? "CMS Admin" : r.charAt(0).toUpperCase() + r.slice(1)}
                            </option>
                          ))}
                        </select>
                        {updatingId === user.id ? (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2">
                            <svg className="animate-spin w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                          </span>
                        ) : (
                          <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        )}
                      </div>
                    </td>

                    {/* Joined date */}
                    <td className="px-5 py-4 text-slate-400 text-xs hidden md:table-cell">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-4 text-right">
                      {confirmDeleteId === user.id ? (
                        <div className="inline-flex items-center gap-2">
                          <span className="text-xs text-slate-500">Sure?</span>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={deletingId === user.id}
                            className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold disabled:opacity-60 transition-colors"
                          >
                            {deletingId === user.id ? "Removing…" : "Yes, remove"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(user.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold border border-red-200 transition-colors"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer count */}
        {!loading && (
          <p className="text-xs text-blue-700/60 mt-3 text-right">
            Showing {filtered.length} of {users.length} users
          </p>
        )}

      </div>
    </main>
  );
}