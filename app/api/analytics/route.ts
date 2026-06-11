// app/api/analytics/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_BACK = 6;

interface MonthlySubmission {
  month: string;
  submissions: number;
}

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  // --- Auth + role check ---------------------------------------------------
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("Analytics User:", user);
  console.log("Analytics User Error:", userError);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    (profile.role !== "cms_admin" && profile.role !== "super_admin")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // --- Summary metrics -----------------------------------------------------
  try {
    const [
      totalAuthors,
      pendingAuthorRequests,
      totalArticles,
      draftArticles,
      // "Submitted" = all articles that left the draft stage
      submittedArticles,
      publishedArticles,
      // "Pending Reviews" = actively waiting for a reviewer decision
      pendingReviews,
    ] = await Promise.all([
      // ✅ role is 'author', not 'writer'
      countRows(supabase, "profiles", (q) => q.eq("role", "author")),

      countRows(supabase, "author_requests", (q) => q.eq("status", "pending")),

      countRows(supabase, "research_articles"),

      countRows(supabase, "research_articles", (q) => q.eq("status", "draft")),

      // ✅ submitted = under_review + changes_requested + approved + published + rejected
      //    i.e. everything that has ever been submitted (left draft)
      countRows(supabase, "research_articles", (q) =>
        q.in("status", ["under_review", "changes_requested", "approved", "published", "rejected"])
      ),

      countRows(supabase, "research_articles", (q) => q.eq("status", "published")),

      // ✅ pending review = only those actively waiting for reviewer action
      countRows(supabase, "research_articles", (q) => q.eq("status", "under_review")),
    ]);

    const monthlySubmissions = await getMonthlySubmissions(supabase);

    return NextResponse.json({
      summary: {
        totalAuthors,
        pendingAuthorRequests,
        totalArticles,
        draftArticles,
        submittedArticles,
        publishedArticles,
        pendingReviews,
      },
      monthlySubmissions,
    });
  } catch (err) {
    console.error("Failed to load admin analytics:", err);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function countRows(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  table: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: (query: any) => any
): Promise<number> {
  let query = supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (filter) {
    query = filter(query);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function getMonthlySubmissions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<MonthlySubmission[]> {
  const since = new Date();
  since.setMonth(since.getMonth() - (MONTHS_BACK - 1));
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  // Count all articles that were submitted (left draft) grouped by created_at month.
  // Excludes pure drafts and rejected articles for a cleaner "submissions" chart.
  const { data, error } = await supabase
    .from("research_articles")
    .select("created_at")
    .in("status", ["under_review", "changes_requested", "approved", "published"])
    .gte("created_at", since.toISOString());

  if (error) {
    throw error;
  }

  const buckets = new Map<string, MonthlySubmission>();
  for (let i = MONTHS_BACK - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    buckets.set(key, { month: MONTH_LABELS[d.getMonth()], submissions: 0 });
  }

  for (const row of data ?? []) {
    const d = new Date(row.created_at as string);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.submissions += 1;
    }
  }

  return Array.from(buckets.values());
}