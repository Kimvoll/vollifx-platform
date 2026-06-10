import Link from "next/link";
import { Banknote, CircleDollarSign, Plus, Repeat2 } from "lucide-react";
import { AccountStatGrid } from "@/components/dashboard/account-stat-grid";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { ChartCard } from "@/components/dashboard/chart-card";

const actions = [
  { href: "/dashboard/deposit", label: "Deposit Funds", icon: Plus },
  { href: "/dashboard/withdraw", label: "Withdraw Funds", icon: Banknote },
  { href: "/dashboard/portfolio", label: "Reinvest Profit", icon: Repeat2 },
  { href: "/dashboard/pools", label: "Join New Pool", icon: CircleDollarSign }
];

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Investor Dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-white light:text-slate-950">Portfolio Command Center</h1>
      </div>
      <AccountStatGrid />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link className="glass flex items-center justify-center gap-3 rounded-lg p-4 text-sm font-black transition hover:-translate-y-1 hover:border-emeraldx/40 hover:text-emeraldx" href={action.href} key={action.label}>
              <Icon size={18} /> {action.label}
            </Link>
          );
        })}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Portfolio Growth Chart" type="growth" />
        <ChartCard title="Weekly Performance Chart" type="weekly" />
        <ChartCard title="Weekly Profit Return Chart" type="roi" />
        <div className="glass rounded-lg p-5">
          <h2 className="text-lg font-black">Leaderboard & Social Proof</h2>
          <div className="mt-5 grid gap-3">
            {["Complete your KYC verification", "Make your first deposit", "Choose Gold Pool or USOIL & NAS100 Pool", "Track results after allocation is confirmed"].map((item) => (
              <div className="rounded-lg bg-white/6 p-4 text-sm text-slate-300 light:bg-slate-100 light:text-slate-700" key={item}>{item}</div>
            ))}
          </div>
        </div>
      </div>
      <ActivityTable />
    </div>
  );
}
