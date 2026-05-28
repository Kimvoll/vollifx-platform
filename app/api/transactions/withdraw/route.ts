import { NextResponse } from "next/server";
import { getBearerUser, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapTransaction } from "@/lib/supabase/mappers";
import { isSchemaCacheError, schemaMigrationMessage } from "@/lib/supabase/errors";

export async function POST(request: Request) {
  const user = await getBearerUser(request);
  if (!user) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const supabase = getSupabaseAdmin();
  const amount = Number(String(body.amount || "0").replace(/[^0-9.]/g, ""));
  if (!amount || amount <= 0) {
    return NextResponse.json({ message: "Enter a valid withdrawal amount." }, { status: 400 });
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("balance, available_balance")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) return NextResponse.json({ message: profileError.message }, { status: 500 });
  const balance = Number(profile?.balance || 0);
  const available = Number(profile?.available_balance || 0);
  if (balance < amount || available < amount) {
    return NextResponse.json({ message: "Insufficient available balance for this withdrawal." }, { status: 400 });
  }
  const { data, error } = await supabase.from("transactions").insert({
    user_id: user.id,
    method: body.method || "Crypto",
    type: "Withdrawal",
    amount,
    status: "Pending",
    reference: `WDR-${Date.now()}`,
    destination: body.destination || body.paypalEmail || body.wallet || "",
    network: body.network || "",
    metadata: {
      paypalEmail: body.paypalEmail || "",
      wallet: body.wallet || "",
      note: body.note || ""
    }
  }).select("*").single();
  if (error) {
    return NextResponse.json({
      message: isSchemaCacheError(error) ? schemaMigrationMessage() : error.message
    }, { status: 500 });
  }
  const { error: balanceError } = await supabase.from("profiles").update({
    balance: balance - amount,
    available_balance: available - amount,
    updated_at: new Date().toISOString()
  }).eq("id", user.id);
  if (balanceError) return NextResponse.json({ message: balanceError.message }, { status: 500 });
  await supabase.from("admin_overrides").insert({
    scope: "admin_notification",
    target_id: data.id,
    values: {
      type: "Withdrawal",
      message: `${user.email || "Investor"} requested a ${body.method || "Crypto"} withdrawal.`,
      amount,
      status: "Pending"
    }
  });

  return NextResponse.json({
    message: "Withdrawal request submitted. Funds have been reserved pending review.",
    transaction: mapTransaction(data)
  }, { status: 201 });
}
