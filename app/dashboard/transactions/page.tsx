import { ActivityTable } from "@/components/dashboard/activity-table";

export default function TransactionsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Ledger</p>
        <h1 className="mt-2 text-3xl font-black">Transactions</h1>
      </div>
      <ActivityTable mode="transactions" />
    </div>
  );
}
