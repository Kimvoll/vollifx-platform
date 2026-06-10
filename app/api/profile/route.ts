import { NextResponse } from "next/server";
import { getBearerUser, getSupabaseAdmin } from "@/lib/supabase/server";
import { money, percent } from "@/lib/supabase/mappers";

export async function GET(request: Request) {
  const user = await getBearerUser(request);
  if (!user) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({
    profile: data,
    balance: money(data?.balance || 0),
    availableBalance: money(data?.available_balance || 0),
    roi: percent(data?.roi || 0),
    kyc: data?.kyc_status || "Pending",
    status: data?.status || "Active"
  });
}

export async function PUT(request: Request) {
  const user = await getBearerUser(request);
  if (!user) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const profile = await request.json().catch(() => ({}));
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("profiles").update({
    full_name: profile.fullName || profile.name || undefined,
    updated_at: new Date().toISOString()
  }).eq("id", user.id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: "Profile saved", profile });
}
