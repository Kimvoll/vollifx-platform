import { NextResponse } from "next/server";
import { ADMIN_EMAIL, getSupabaseAdmin, getSupabaseAnon, publicUser } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }
  if (email === ADMIN_EMAIL) {
    return NextResponse.json({ message: "This email is reserved for the platform admin." }, { status: 409 });
  }
  if (password.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters." }, { status: 400 });
  }

  try {
    const fullName = [body.firstName, body.lastName].filter(Boolean).join(" ") || "New Member";
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: fullName }
    });
    if (error || !data.user) {
      throw new Error(error?.message || "Account could not be created.");
    }
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      role: "investor"
    });
    if (profileError) {
      throw new Error(profileError.message);
    }
    const auth = getSupabaseAnon();
    const { data: sessionData, error: sessionError } = await auth.auth.signInWithPassword({ email, password });
    if (sessionError || !sessionData.session) {
      throw new Error(sessionError?.message || "Account created, but sign-in failed.");
    }

    return NextResponse.json({
      token: sessionData.session.access_token,
      user: publicUser({ email, user_metadata: { name: fullName } }, "investor")
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Account could not be created." }, { status: 409 });
  }
}
