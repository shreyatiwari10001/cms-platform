"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  labelColor: string;
  descColor: string;
  chevronColor: string;
};

function IconWriters() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
      <path d="M16 19h6M19 16v6" />
    </svg>
  );
}

function IconArticles() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  );
}

function IconContent() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="12" rx="1" />
      <rect x="17" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

const navItems: NavItem[] = [
  {
    href: "/dashboard-layout/cms_admin_dashboard/author_request",
    label: "Writer requests",
    description: "Review and approve pending author applications",
    icon: <IconWriters />,
    cardBg: "bg-red-100 hover:bg-red-100",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    labelColor: "text-red-900",
    descColor: "text-red-700",
    chevronColor: "text-red-400",
  },
  {
    href: "/dashboard-layout/cms_admin_dashboard/review-articles",
    label: "Review articles",
    description: "Approve or reject submitted drafts",
    icon: <IconArticles />,
    cardBg: "bg-emerald-100 hover:bg-emerald-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    labelColor: "text-emerald-900",
    descColor: "text-emerald-700",
    chevronColor: "text-emerald-400",
  },
  {
    href: "/dashboard-layout/cms_admin_dashboard/content",
    label: "CMS content",
    description: "Browse and manage all published pages",
    icon: <IconContent />,
    cardBg: "bg-purple-100 hover:bg-purple-100",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    labelColor: "text-purple-900",
    descColor: "text-purple-700",
    chevronColor: "text-purple-400",
  },
  {
    href: "/dashboard-layout/cms_admin_dashboard/analytics",
    label: "Analytics",
    description: "Track traffic, views, and engagement",
    icon: <IconAnalytics />,
    cardBg: "bg-yellow-50 hover:bg-yellow-100",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-700",
    labelColor: "text-yellow-900",
    descColor: "text-yellow-700",
    chevronColor: "text-yellow-500",
  },
];

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
      <main className="min-h-screen flex items-center justify-center bg-[#dce8f8]">
        <p className="text-sm text-blue-700 animate-pulse">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#dce8f8] px-6 py-10 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-1">CMS Admin</h1>
          <p className="text-base text-blue-700/70">Manage content, writers, and platform activity</p>
        </div>

        {/* Primary nav — 2-column pastel cards with white border */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-start gap-4 ${item.cardBg} border-2 border-white rounded-2xl shadow-md px-6 py-6 transition-all duration-150`}
            >
              <span className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 mt-0.5 ${item.iconBg} ${item.iconColor}`}>
                {item.icon}
              </span>
              <span className="flex-1 min-w-0">
                <span className={`block text-[15px] font-bold ${item.labelColor} mb-1`}>
                  {item.label}
                </span>
                <span className={`block text-[13px] ${item.descColor} leading-snug`}>
                  {item.description}
                </span>
              </span>
              <span className={`${item.chevronColor} mt-1 shrink-0 transition-transform duration-150 group-hover:translate-x-1`}>
                <IconChevron />
              </span>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-blue-200 my-6" />

        {/* Manage Users — pastel brown with white border */}
        <Link
          href="/dashboard-layout/cms_admin_dashboard/user"
          className="group flex items-center gap-4 bg-amber-100 hover:bg-amber-150 border-2 border-white rounded-2xl shadow-md px-6 py-5 transition-all duration-150"
        >
          <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-amber-100 text-amber-900">
            <IconUsers />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-bold text-amber-950 mb-0.5">
              Manage users
            </span>
            <span className="block text-[13px] text-amber-800">
              Roles, access levels, and account settings
            </span>
          </span>
          <span className="text-amber-400 shrink-0 transition-transform duration-150 group-hover:translate-x-1">
            <IconChevron />
          </span>
        </Link>

      </div>
    </main>
  );
}