import { NextResponse } from "next/server";
import { adminRules } from "@/lib/dashboard-data";
import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("admin_overrides")
    .select("values")
    .eq("scope", "rules")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return NextResponse.json({ rules: data?.values?.rules || adminRules, modules: data?.values?.modules || {} });
}

export async function PUT(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
  const body = await request.json().catch(() => ({}));
  const values = {
    rules: body.rules || adminRules,
    modules: body.modules || {},
    savedAt: new Date().toISOString()
  };
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("admin_overrides").insert({
    scope: "rules",
    target_id: "dashboard",
    values,
    created_by: adminCheck.user.id
  });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({
    message: "Admin dashboard rules saved.",
    ...values
  });
}
