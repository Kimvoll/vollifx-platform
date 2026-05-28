import { NextResponse } from "next/server";
import { getBearerUser, getSupabaseAdmin } from "@/lib/supabase/server";

const wallets = {
  BTC: "bc1q9fmvaulvhfgylprs65c736pztper3wun7tnews",
  USDT_ERC20: "0xcD023Df55D674142ecd8DA74AeB898Fa6F6cfF2c"
};

export async function POST(request: Request) {
  const user = await getBearerUser(request);
  if (!user) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const asset = body.asset === "BTC" ? "BTC" : "USDT_ERC20";
  const supabase = getSupabaseAdmin();
  const { data: payment, error } = await supabase.from("payments").insert({
    user_id: user.id,
    pool_id: body.poolId === "wallet-deposit" ? null : body.poolId,
    amount: Number(body.amount || 500),
    currency: body.currency || "USD",
    asset,
    wallet: wallets[asset],
    status: "Awaiting blockchain confirmation",
    provider: "Crypto",
    customer: body
  }).select("*").single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({
    provider: "Crypto",
    payment: {
      id: payment.id,
      poolId: payment.pool_id,
      amount: payment.amount,
      asset: payment.asset,
      wallet: payment.wallet,
      status: payment.status,
      provider: payment.provider,
      createdAt: payment.created_at,
      customer: payment.customer
    }
  }, { status: 201 });
}
