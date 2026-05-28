import { NextResponse } from "next/server";
import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase/server";
import { money, percent } from "@/lib/supabase/mappers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({
    users: (data || []).map((user) => ({
      id: user.id,
      name: user.full_name || user.email,
      email: user.email,
      role: user.role,
      balance: money(user.balance),
      availableBalance: money(user.available_balance),
      roi: percent(user.roi),
      kyc: user.kyc_status,
      status: user.status
    }))
  });
}

export async function PUT(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
  const body = await request.json().catch(() => ({}));
  const supabase = getSupabaseAdmin();
  const updates = {
    balance: Number(String(body.balance || "0").replace(/[^0-9.-]/g, "")),
    available_balance: Number(String(body.availableBalance || body.balance || "0").replace(/[^0-9.-]/g, "")),
    roi: Number(String(body.roi || "0").replace(/[^0-9.-]/g, "")),
    kyc_status: body.kyc || "Pending",
    status: body.status || "Active",
    updated_at: new Date().toISOString()
  };
  const { error } = await supabase.from("profiles").update(updates).eq("id", body.userId);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  await supabase.from("admin_overrides").insert({
    scope: "user",
    target_id: body.userId,
    values: updates,
    created_by: adminCheck.user.id
  });

  return NextResponse.json({
    message: "User dashboard override saved.",
    override: { userId: body.userId, ...updates }
  });
}
