import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { requestId, userId } = await req.json();

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({ role: "author" })
    .eq("id", userId);

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 500 }
    );
  }

  const { error: requestError } = await supabaseAdmin
    .from("author_requests")
    .update({ status: "approved" })
    .eq("id", requestId);

  if (requestError) {
    return NextResponse.json(
      { error: requestError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}