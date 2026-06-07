import Link from "next/link";

export default function DashboardPage() {
  const benefits = [
    "Create and publish articles",
    "Access the rich content editor",
    "Manage your own drafts",
    "Collaborate with editors & publishers",
  ];

  return (
    <div className="min-h-screen bg-[#eef2fb] p-6 font-sans">

      {/* Page title */}
      <h1 className="text-5xl font-bold text-[#1a2e6e] mb-5"
        style={{ fontFamily: "'Lora', serif" }}>
        Dashboard
      </h1>

      {/* Welcome banner */}
      <div className="relative bg-[#1a2e6e] rounded-2xl p-8 mb-5 overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute right-24 bottom-0 w-48 h-48 rounded-full bg-[#2563eb]/40 translate-y-1/2 pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-white text-3xl font-bold mb-2"
            style={{ fontFamily: "'Lora', serif" }}>
            Welcome to CMS Platform
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-md mb-6">
            You&apos;re currently a <span className="text-white font-semibold">User</span>. Request author access to start creating and publishing content.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/author_request">
              <button className="bg-[#2563eb] hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors shadow-md">
                + Request Author Access
              </button>
            </Link>
            
          </div>
        </div>
      </div>

      {/* Benefits + access row — FIXED: was grid-cols-0 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">

        {/* Author benefits */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-5">
            Author Benefits
          </p>
          <ul className="flex flex-col gap-4 list-none">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  ✓
                </span>
                <span className="text-sm font-medium text-[#1a2e6e]">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Current access */}
        <div className="bg-white rounded-2xl p-6 border border-blue-100 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-5">
              Current Access
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#eef2fb] flex items-center justify-center text-xl">
                🔒
              </div>
              <div>
                <p className="text-sm font-bold text-[#1a2e6e]">User</p>
                <p className="text-xs text-blue-400">Read-only access</p>
              </div>
            </div>
            <p className="text-sm text-blue-400 leading-relaxed">
              Upgrade to Author to unlock content creation, drafts, and publishing tools.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-blue-50 flex items-center gap-2">
            <span className="text-base">🗓️</span>
            <p className="text-xs text-blue-500">
              Requests reviewed by admins within 24–48 hours.
            </p>
          </div>
        </div>
      </div>

     

    </div>
  );
}