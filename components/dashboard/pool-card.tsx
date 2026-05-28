import Link from "next/link";
import { ArrowRight, ShieldAlert, UsersRound } from "lucide-react";

type Pool = {
  id: string;
  name: string;
  manager: string;
  capital: string;
  monthlyRoi: string;
  winRate: string;
  drawdown: string;
  risk: string;
  investors: number;
  minimum: string;
  status: string;
  asset: string;
  returnSummary?: string;
};

export function PoolCard({ pool }: { pool: Pool }) {
  return (
    <div className="glass rounded-lg p-5 transition hover:-translate-y-1 hover:border-emeraldx/40 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-goldx">{pool.asset}</p>
          <h2 className="mt-2 text-xl font-black text-white light:text-slate-950">{pool.name}</h2>
          <p className="mt-1 text-sm text-slate-400 light:text-slate-600">Managed by {pool.manager}</p>
        </div>
        <span className="rounded-full bg-emeraldx/10 px-3 py-1 text-xs font-black text-emeraldx">{pool.status}</span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        {[
          ["Capital", pool.capital],
          ["Profit Return", pool.monthlyRoi],
          ["Win Rate", pool.winRate],
          ["Max Drawdown", pool.drawdown],
          ["Risk Level", pool.risk],
          ["Minimum", pool.minimum]
        ].map(([label, value]) => (
          <div className="rounded-lg bg-white/6 p-3 light:bg-slate-100" key={label}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 font-black text-white light:text-slate-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-400 light:text-slate-600">
        <span className="inline-flex items-center gap-2"><UsersRound size={16} /> {pool.investors.toLocaleString()} investors</span>
        <span className="inline-flex items-center gap-2"><ShieldAlert size={16} /> {pool.risk}</span>
      </div>
      {pool.returnSummary ? (
        <p className="mt-4 rounded-lg bg-emeraldx/10 p-3 text-sm font-bold text-emeraldx">{pool.returnSummary}</p>
      ) : null}
      <Link className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emeraldx px-5 py-3 text-sm font-black text-ink shadow-glow transition hover:bg-white" href={`/dashboard/pools/${pool.id}`}>
        Join Pool <ArrowRight size={17} />
      </Link>
    </div>
  );
}
