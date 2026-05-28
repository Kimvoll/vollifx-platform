import { ActivityTable } from "@/components/dashboard/activity-table";
import { AdminControls } from "@/components/dashboard/admin-controls";
import { AdminTransactions } from "@/components/dashboard/admin-transactions";
import { ChartCard } from "@/components/dashboard/chart-card";
import { adminStats } from "@/lib/dashboard-data";

export default function AdminPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-black">Platform Operations</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {adminStats.map(([label, value]) => (
          <div className="glass rounded-lg p-5" key={label}>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Investor Analytics" type="growth" />
        <ChartCard title="Pool Performance" type="roi" />
      </div>
      <AdminTransactions />
      <AdminControls />
      <div className="grid gap-6 xl:grid-cols-2">
        <ActivityTable mode="transactions" />
        <div className="glass rounded-lg p-5">
          <h2 className="text-lg font-black">Support Tickets</h2>
          <div className="mt-4 grid gap-3">
            {["KYC review requested", "Withdrawal limit question", "Pool report download issue", "Authenticator reset request"].map((item) => (
              <div className="rounded-lg bg-white/6 p-4 text-sm light:bg-slate-100" key={item}>{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
