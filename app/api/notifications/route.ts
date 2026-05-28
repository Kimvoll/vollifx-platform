import { NextResponse } from "next/server";
import { getBearerUser, getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getBearerUser(request);
  if (!user) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({
    notifications: (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      message: item.message,
      status: item.status,
      createdAt: item.created_at
    }))
  });
}
