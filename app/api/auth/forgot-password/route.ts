import { NextResponse } from "next/server";
import { getSupabaseAnon } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ message: "Enter your registered email first." }, { status: 400 });
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vollitrading.com";
  const supabase = getSupabaseAnon();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/login`
  });
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json({
    message: "Password reset instructions have been sent if the email is registered."
  });
}
