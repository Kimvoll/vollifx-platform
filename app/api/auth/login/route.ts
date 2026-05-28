import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseAnon, publicUser } from "@/lib/supabase/server";

const ADMIN_EMAIL = "vollikip@gmail.com";
const ADMIN_PASSWORD = "1209Kip.";
const ADMIN_PASSWORD_ALT = "1209Kip";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || body.username || "").trim().toLowerCase();
  const password = String(body.password || "");
  const isAdminEmail = email === ADMIN_EMAIL;

  if (isAdminEmail && password !== ADMIN_PASSWORD && password !== ADMIN_PASSWORD_ALT) {
    return NextResponse.json({ message: "Invalid admin password." }, { status: 401 });
  }

  if (isAdminEmail) {
    const admin = getSupabaseAdmin();
    const { data: existing } = await admin.auth.admin.listUsers();
    const adminUser = existing.users.find((user) => user.email?.toLowerCase() === ADMIN_EMAIL);
    if (!adminUser) {
      const { data, error } = await admin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password,
        email_confirm: true,
        user_metadata: { name: "Volli Admin" }
      });
      if (error || !data.user) {
        return NextResponse.json({ message: error?.message || "Could not create admin user." }, { status: 500 });
      }
      await admin.from("profiles").upsert({
        id: data.user.id,
        email: ADMIN_EMAIL,
        full_name: "Volli Admin",
        role: "admin"
      });
    } else {
      await admin.auth.admin.updateUserById(adminUser.id, {
        password,
        email_confirm: true,
        user_metadata: { name: "Volli Admin" }
      });
      await admin.from("profiles").upsert({
        id: adminUser.id,
        email: ADMIN_EMAIL,
        full_name: "Volli Admin",
        role: "admin"
      });
    }
  }

  const auth = getSupabaseAnon();
  const { data, error } = await auth.auth.signInWithPassword({ email, password });
  if (error || !data.user || !data.session) {
    return NextResponse.json({ message: error?.message || "Invalid login." }, { status: 401 });
  }
  const admin = getSupabaseAdmin();
  const { data: profile } = await admin
    .from("profiles")
    .select("role, full_name")
    .eq("id", data.user.id)
    .maybeSingle();
  if (!profile) {
    await admin.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: String(data.user.user_metadata?.name || email),
      role: isAdminEmail ? "admin" : "investor"
    });
  }

  return NextResponse.json({
    token: data.session.access_token,
    user: publicUser({ ...data.user, user_metadata: { name: profile?.full_name || data.user.user_metadata?.name || email } }, profile?.role || (isAdminEmail ? "admin" : "investor"))
  });
}
