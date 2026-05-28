import { NextResponse } from "next/server";
import { getBearerUser, getSupabaseAdmin } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  const user = await getBearerUser(request);
  if (!user) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const settings = await request.json().catch(() => ({}));
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("settings").insert({
    user_id: user.id,
    section: settings.section || "General",
    values: settings
  });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: "Settings saved", settings });
}
