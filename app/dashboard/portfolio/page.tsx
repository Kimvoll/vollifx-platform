import { ChartCard } from "@/components/dashboard/chart-card";
import { StatCard } from "@/components/dashboard/stat-card";

export default function PortfolioPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Investor Portfolio</p>
        <h1 className="mt-2 text-3xl font-black">Allocation & Compounding</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Allocated Capital" value="$0.00" change="0.0%" trend="neutral" />
        <StatCard label="Profit History" value="$0.00" change="0.0%" trend="neutral" />
        <StatCard label="Compounding Rate" value="0%" change="0.0%" trend="neutral" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Portfolio Diversification" type="pie" />
        <ChartCard title="Compounding Analytics" type="growth" />
      </div>
      <div className="glass rounded-lg p-5">
        <h2 className="text-lg font-black">Investment Timeline</h2>
        <div className="mt-5 grid gap-3">
          {["No active investments yet", "No profit history yet", "Deposit funds to begin allocation", "Weekly performance statements appear after pool activity begins"].map((item) => (
            <div className="rounded-lg bg-white/6 p-4 text-sm text-slate-300 light:bg-slate-100 light:text-slate-700" key={item}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
