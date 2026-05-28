import { NextResponse } from "next/server";
import { pools } from "@/lib/dashboard-data";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { mapPool } from "@/lib/supabase/mappers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("pools").select("*").order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ pools: (data || []).map(mapPool) });
  } catch {
    return NextResponse.json({ pools });
  }
}
