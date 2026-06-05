import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    { label: "Total Articles", value: "0", emoji: "📄", color: "text-blue-600" },
    { label: "Published", value: "0", emoji: "✅", color: "text-emerald-600" },
    { label: "Drafts", value: "0", emoji: "✏️", color: "text-amber-500" },
    { label: "Access Level", value: "User", emoji: "🔒", color: "text-violet-600" },
  ];

  const benefits = [
    "Create and publish articles",
    "Access the rich content editor",
    "Manage your own drafts",
    "Collaborate with editors & publishers",
  ];

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 flex flex-col font-sans">

      {/* Top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur border-b border-indigo-100">
        <div>
          <h1 className="text-xl font-bold text-blue-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Home / Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl border border-indigo-100 bg-white flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-400 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
            N
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-8 py-8 flex flex-col gap-7 max-w-5xl w-full mx-auto">

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/80 backdrop-blur rounded-2xl p-5 flex items-center gap-4 border border-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {s.emoji}
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-extrabold leading-none ${s.color}`}>{s.value}</span>
                <span className="text-xs text-gray-400 mt-1 font-medium">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Welcome + benefits row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          {/* Welcome card — spans 2 cols */}
          <div className="md:col-span-2 bg-white/90 backdrop-blur rounded-2xl p-8 border border-white shadow-sm flex flex-col gap-7">
            <div className="flex gap-5 items-start">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900 tracking-tight mb-2">Welcome to CMS Platform</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  You&apos;re currently a <span className="font-semibold text-gray-700">User</span>. Request author access to start creating and publishing content on the platform.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/author_request"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Request Author Access
              </Link>
              <button className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 text-sm font-medium px-5 py-3 rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-all bg-white">
                Learn More
              </button>
            </div>
          </div>

          {/* Benefits panel */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-white shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-blue-900">Author Benefits</h3>
            <ul className="flex flex-col gap-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-gray-100 flex gap-2 items-start text-xs text-gray-400 leading-relaxed">
              <svg className="mt-0.5 flex-shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Requests are reviewed by admins within 24–48 hours.
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}