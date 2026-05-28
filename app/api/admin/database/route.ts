import { NextResponse } from "next/server";
import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
  const supabase = getSupabaseAdmin();
  const tables = ["profiles", "transactions", "payments", "allocations", "kyc_submissions", "settings", "pools", "admin_overrides", "notifications"];
  const counts = Object.fromEntries(await Promise.all(tables.map(async (table) => {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
    return [table, count || 0];
  })));
  return NextResponse.json({
    counts
  });
}
