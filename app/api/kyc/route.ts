import { NextResponse } from "next/server";
import { getBearerUser, getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await getBearerUser(request);
  if (!user) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const supabase = getSupabaseAdmin();
  const { data: submission, error } = await supabase.from("kyc_submissions").insert({
    user_id: user.id,
    document: body.document || "Document",
    status: "Pending review",
    metadata: body
  }).select("*").single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({
    message: `${submission.document} submitted for KYC review.`,
    status: submission.status,
    submission
  }, { status: 201 });
}
