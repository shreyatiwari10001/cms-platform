"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/author_request",
    label: "Author Requests",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-56 min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col shadow-xl">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-7 pb-5">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <span className="text-base font-bold tracking-tight">CMS Platform</span>
      </div>

      <div className="mx-5 h-px bg-white/10" />

      {/* Section label */}
      <p className="px-5 pt-5 pb-2 text-[10px] font-bold tracking-widest text-white/35 uppercase">
        Main Menu
      </p>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? "bg-white/18 text-white font-semibold"
                  : "text-white/60 hover:bg-white/10 hover:text-white hover:translate-x-0.5"
                }`}
            >
              <span className="flex-shrink-0">{icon}</span>
              <span className="flex-1">{label}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col gap-2 px-3 pb-5">
        <div className="mx-2 h-px bg-white/10 mb-1" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-red-500/15 hover:text-red-300 transition-all duration-150 w-full text-left"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>

        {/* User chip */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/8 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
            N
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white leading-tight truncate">User</span>
            <span className="text-[11px] text-white/40 leading-tight">Member</span>
          </div>
        </div>
      </div>

    </aside>
  );
}