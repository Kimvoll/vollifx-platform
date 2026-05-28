import { NextResponse } from "next/server";
import { getSupabaseAdmin, requireAdmin } from "@/lib/supabase/server";
import { mapTransaction, money } from "@/lib/supabase/mappers";
import { isSchemaCacheError, schemaMigrationMessage } from "@/lib/supabase/errors";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() || "";
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ message: isSchemaCacheError(error) ? schemaMigrationMessage() : error.message }, { status: 500 });
  const userIds = Array.from(new Set((data || []).map((row: any) => row.user_id).filter(Boolean)));
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, email, full_name").in("id", userIds)
    : { data: [] as any[] };
  const profileMap = new Map((profiles || []).map((profile: any) => [profile.id, profile]));
  const rows = (data || []).map((row: any) => ({
    ...mapTransaction(row),
    userId: row.user_id,
    userName: profileMap.get(row.user_id)?.full_name || profileMap.get(row.user_id)?.email || "Investor",
    userEmail: profileMap.get(row.user_id)?.email || ""
  }));
  const filtered = query
    ? rows.filter((row) => [row.id, row.userEmail, row.userName, row.status, row.type, row.method].some((value) => String(value).toLowerCase().includes(query)))
    : rows;
  const totals = rows.reduce((summary, row: any) => {
    const amount = Number(String(row.amount).replace(/[^0-9.]/g, ""));
    if (row.type === "Deposit" && row.status === "Approved") summary.deposits += amount;
    if (row.type === "Withdrawal" && row.status === "Approved") summary.withdrawals += amount;
    if (["Pending", "Pending Review", "Processing"].includes(row.status)) summary.pending += amount;
    return summary;
  }, { deposits: 0, withdrawals: 0, pending: 0 });
  return NextResponse.json({
    transactions: filtered,
    totals: {
      deposits: money(totals.deposits),
      withdrawals: money(totals.withdrawals),
      pending: money(totals.pending)
    }
  });
}

export async function PATCH(request: Request) {
  const adminCheck = await requireAdmin(request);
  if (!adminCheck.ok) return NextResponse.json({ message: adminCheck.message }, { status: adminCheck.status });
  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");
  const action = String(body.action || "").toLowerCase();
  if (!id || !["approve", "reject", "processing"].includes(action)) {
    return NextResponse.json({ message: "Transaction id and action are required." }, { status: 400 });
  }
  const supabase = getSupabaseAdmin();
  const { data: transaction, error: fetchError } = await supabase.from("transactions").select("*").eq("id", id).maybeSingle();
  if (fetchError) return NextResponse.json({ message: isSchemaCacheError(fetchError) ? schemaMigrationMessage() : fetchError.message }, { status: 500 });
  if (!transaction) return NextResponse.json({ message: "Transaction not found." }, { status: 404 });

  const nextStatus = action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Processing";
  if (transaction.status === "Approved" || transaction.status === "Rejected") {
    return NextResponse.json({ message: `Transaction is already ${transaction.status}.` }, { status: 409 });
  }

  const amount = Number(transaction.amount || 0);
  const { data: profile } = await supabase.from("profiles").select("balance, available_balance").eq("id", transaction.user_id).maybeSingle();
  const balance = Number(profile?.balance || 0);
  const available = Number(profile?.available_balance || 0);

  if (transaction.type === "Deposit" && nextStatus === "Approved") {
    const { error } = await supabase.from("profiles").update({
      balance: balance + amount,
      available_balance: available + amount,
      updated_at: new Date().toISOString()
    }).eq("id", transaction.user_id);
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (transaction.type === "Withdrawal" && nextStatus === "Rejected") {
    const { error } = await supabase.from("profiles").update({
      balance: balance + amount,
      available_balance: available + amount,
      updated_at: new Date().toISOString()
    }).eq("id", transaction.user_id);
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const { data: updated, error: updateError } = await supabase.from("transactions").update({
    status: nextStatus,
    reviewed_by: adminCheck.user.id,
    reviewed_at: new Date().toISOString()
  }).eq("id", id).select("*").single();
  if (updateError) return NextResponse.json({ message: isSchemaCacheError(updateError) ? schemaMigrationMessage() : updateError.message }, { status: 500 });

  await supabase.from("notifications").insert({
    user_id: transaction.user_id,
    title: `${transaction.type} ${nextStatus}`,
    message: `Your ${transaction.type.toLowerCase()} of ${money(amount)} is now ${nextStatus}.`,
    metadata: { transactionId: id, action }
  });

  return NextResponse.json({
    message: `${transaction.type} marked as ${nextStatus}.`,
    transaction: mapTransaction(updated)
  });
}
