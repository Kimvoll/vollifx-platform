import { NextResponse } from "next/server";
import { adminStats } from "@/lib/dashboard-data";
import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("admin_overrides")
    .select("values")
    .eq("scope", "operations")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return NextResponse.json({ operations: data?.values || adminStats });
}

export async function PUT(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
  const body = await request.json().catch(() => ({}));
  const values = {
    operations: body.operations || adminStats,
    settings: {
      platformStatus: body.platformStatus || "Operational",
      depositsEnabled: body.depositsEnabled ?? true,
      withdrawalsEnabled: body.withdrawalsEnabled ?? true,
      poolJoiningEnabled: body.poolJoiningEnabled ?? true,
      kycRequired: body.kycRequired ?? true
    },
    savedAt: new Date().toISOString()
  };
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("admin_overrides").insert({
    scope: "operations",
    target_id: "platform",
    values,
    created_by: adminCheck.user.id
  });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({
    message: "Platform operations saved.",
    ...values
  });
}
