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
    return NextResponse.json({ message: "Enter a valid deposit amount." }, { status: 400 });
  }
  const { data, error } = await supabase.from("transactions").insert({
    user_id: user.id,
    method: body.method || "Crypto",
    type: "Deposit",
    amount,
    status: "Pending Review",
    reference: body.reference || body.paymentId || `DEP-${Date.now()}`,
    destination: body.wallet || body.destination || "",
    network: body.network || "",
    proof_url: body.proofUrl || "",
    metadata: {
      paymentId: body.paymentId || null,
      asset: body.asset || null,
      customer: body.customer || {},
      note: body.note || ""
    }
  }).select("*").single();
  if (error) {
    return NextResponse.json({
      message: isSchemaCacheError(error) ? schemaMigrationMessage() : error.message
    }, { status: 500 });
  }
  if (body.paymentId) {
    const { error: paymentError } = await supabase.from("payments").update({ status: "Pending Review", proof_url: body.proofUrl || "" }).eq("id", body.paymentId);
    if (paymentError && isSchemaCacheError(paymentError)) {
      return NextResponse.json({ message: schemaMigrationMessage() }, { status: 500 });
    }
  }
  await supabase.from("admin_overrides").insert({
    scope: "admin_notification",
    target_id: data.id,
    values: {
      type: "Deposit",
      message: `${user.email || "Investor"} submitted a ${body.method || "Crypto"} deposit for review.`,
      amount,
      status: "Pending Review"
    }
  });

  return NextResponse.json({
    message: "Deposit submitted for admin review.",
    transaction: mapTransaction(data)
  }, { status: 201 });
}
