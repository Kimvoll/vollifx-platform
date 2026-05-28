import { notFound } from "next/navigation";
import { ArrowRight, Calculator, ToggleRight } from "lucide-react";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { ChartCard } from "@/components/dashboard/chart-card";
import { JoinPoolButton } from "@/components/dashboard/join-pool-button";
import { openTrades, closedTrades, pools } from "@/lib/dashboard-data";

export default function PoolDetailsPage({ params }: { params: { id: string } }) {
  const pool = pools.find((item) => item.id === params.id);
  if (!pool) notFound();

  return (
    <div className="grid gap-6">
      <div className="glass rounded-lg p-6">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">{pool.asset} Pool</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-white light:text-slate-950">{pool.name}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400 light:text-slate-600">
              Institutional investment strategy managed by {pool.manager}, balancing active execution, strict drawdown controls, and transparent weekly profit reporting.
            </p>
          </div>
          <a className="inline-flex items-center justify-center gap-2 rounded-full bg-emeraldx px-6 py-3 text-sm font-black text-ink shadow-glow transition hover:bg-white" href="#payment">
            Join Pool <ArrowRight size={17} />
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Capital Size", pool.capital],
          ["Profit Return", pool.monthlyRoi],
          ["Win Rate", pool.winRate],
          ["Max Drawdown", pool.drawdown]
        ].map(([label, value]) => (
          <div className="glass rounded-lg p-5" key={label}>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-lg p-5 sm:p-6" id="payment">
        <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Payment & Allocation</p>
            <h2 className="mt-2 text-2xl font-black text-white light:text-slate-950">Join {pool.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">
              Complete the minimum payment first. After payment is initiated, your pool allocation is submitted for confirmation.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["Minimum", pool.minimum],
                ["Return", pool.monthlyRoi],
                ["Manager", pool.manager]
              ].map(([label, value]) => (
                <div className="rounded-lg bg-white/6 p-4 light:bg-slate-100" key={label}>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 font-black text-white light:text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <JoinPoolButton className="w-full rounded-full bg-emeraldx px-6 py-3 text-sm font-black text-ink shadow-glow transition hover:bg-white" minimum={pool.minimum} poolId={pool.id} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Equity Curve" type="growth" />
        <ChartCard title="Historical ROI" type="roi" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="glass rounded-lg p-5 xl:col-span-2">
          <h2 className="text-lg font-black">Risk Management Metrics</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Risk rules are applied after allocation", "Drawdown data appears after trading begins", "Asset exposure controls", "Daily loss limit controls", "Compounding available", "Weekly reports appear after activity begins"].map((item) => (
              <div className="rounded-lg bg-white/6 p-4 text-sm text-slate-300 light:bg-slate-100 light:text-slate-700" key={item}>{item}</div>
            ))}
          </div>
        </div>
        <div className="glass rounded-lg p-5">
          <h2 className="flex items-center gap-2 text-lg font-black"><Calculator size={19} /> Earnings Calculator</h2>
          <label className="mt-5 grid gap-2 text-sm font-bold">
            Investment Amount
            <input className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emeraldx light:border-slate-200 light:bg-white" defaultValue="$0" />
          </label>
          <label className="mt-4 flex items-center justify-between rounded-lg bg-white/6 p-4 text-sm font-bold light:bg-slate-100">
            Compound Profit <ToggleRight className="text-emeraldx" />
          </label>
          <p className="mt-5 rounded-lg bg-emeraldx/10 p-4 text-sm text-emeraldx">{pool.returnSummary ?? "Estimated weekly earnings available after allocation."}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <TradeBox title="Open Trades" rows={openTrades} />
        <TradeBox title="Closed Trades" rows={closedTrades} />
      </div>
      <ActivityTable />
    </div>
  );
}

function TradeBox({ title, rows }: { title: string; rows: Record<string, string>[] }) {
  return (
    <div className="glass rounded-lg p-5">
      <h2 className="text-lg font-black">{title}</h2>
      <div className="mt-4 grid gap-2">
        {rows.length === 0 ? (
          <div className="rounded-lg bg-white/6 p-4 text-sm text-slate-400 light:bg-slate-100 light:text-slate-600">No trades yet. Trading data appears after this pool becomes active.</div>
        ) : rows.map((row) => (
          <div className="grid grid-cols-4 gap-2 rounded-lg bg-white/6 p-3 text-sm light:bg-slate-100" key={Object.values(row).join("-")}>
            {Object.values(row).map((value) => <span key={value}>{value}</span>)}
          </div>
        ))}
      </div>
    </div>
  );
}
