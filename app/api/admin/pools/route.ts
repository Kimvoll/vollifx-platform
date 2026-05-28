import { NextResponse } from "next/server";
import { pools } from "@/lib/dashboard-data";
import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
  const body = await request.json().catch(() => ({}));
  const pool = {
    poolId: body.poolId || pools[0]?.id,
    minimum: body.minimum,
    returnSummary: body.returnSummary,
    status: body.status,
    risk: body.risk,
    savedAt: new Date().toISOString()
  };
  const supabase = getSupabaseAdmin();
  const updates = {
    minimum_deposit: Number(String(body.minimum || "500").replace(/[^0-9.]/g, "")) || 500,
    return_label: body.returnSummary || "5x weekly",
    return_summary: body.returnSummary || "5x weekly",
    status: body.status || "Open",
    risk: body.risk || "Medium",
    updated_at: new Date().toISOString()
  };
  const { error } = await supabase.from("pools").update(updates).eq("id", pool.poolId);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  await supabase.from("admin_overrides").insert({
    scope: "pool",
    target_id: pool.poolId,
    values: pool,
    created_by: adminCheck.user.id
  });

  return NextResponse.json({
    message: "Pool settings override saved.",
    pool
  });
}
