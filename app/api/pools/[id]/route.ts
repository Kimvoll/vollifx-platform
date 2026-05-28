import { NextResponse } from "next/server";
import { closedTrades, openTrades, pools } from "@/lib/dashboard-data";
import { getBearerUser, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapPool } from "@/lib/supabase/mappers";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  let pool = pools.find((item) => item.id === params.id);
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase.from("pools").select("*").eq("id", params.id).maybeSingle();
    if (data) pool = mapPool(data);
  } catch {
  }
  if (!pool) {
    return NextResponse.json({ message: "Pool not found" }, { status: 404 });
  }

  return NextResponse.json({ pool, openTrades, closedTrades });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getBearerUser(request);
  if (!user) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const supabase = getSupabaseAdmin();
  const { data: poolRow } = await supabase.from("pools").select("*").eq("id", params.id).maybeSingle();
  const pool = poolRow ? mapPool(poolRow) : pools.find((item) => item.id === params.id);
  if (!pool) {
    return NextResponse.json({ message: "Pool not found" }, { status: 404 });
  }
  const body = await request.json().catch(() => ({}));

  if (!body.paymentId) {
    return NextResponse.json({ message: "Payment is required before joining this pool." }, { status: 402 });
  }
  const amount = Number(String(body.amount || pool.minimum || "500").replace(/[^0-9.]/g, "")) || 500;
  const { data: allocation, error } = await supabase.from("allocations").insert({
    user_id: user.id,
    pool_id: pool.id,
    payment_id: body.paymentId,
    amount,
    status: "Pending payment confirmation"
  }).select("*").single();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({
    message: `Payment received for review. Allocation request submitted for ${pool.name}.`,
    allocation: {
      id: allocation.id,
      poolId: allocation.pool_id,
      paymentId: allocation.payment_id,
      amount: allocation.amount,
      status: allocation.status,
      createdAt: allocation.created_at,
      minimum: pool.minimum
    }
  });
}
