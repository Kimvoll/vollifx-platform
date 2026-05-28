import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  trend?: string;
};

export function StatCard({ label, value, change, trend = "neutral" }: StatCardProps) {
  const positive = trend === "up";
  const negative = trend === "down";
  const Icon = positive ? ArrowUpRight : negative ? ArrowDownRight : Minus;

  return (
    <div className="glass rounded-lg p-5 transition duration-300 hover:-translate-y-1 hover:border-emeraldx/40 hover:shadow-glow">
      <p className="text-sm font-semibold text-slate-400 light:text-slate-600">{label}</p>
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-2xl font-black text-white light:text-slate-950">{value}</p>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${positive ? "bg-emeraldx/10 text-emeraldx" : negative ? "bg-rose-500/10 text-rose-400" : "bg-goldx/10 text-goldx"}`}>
          <Icon size={14} /> {change}
        </span>
      </div>
    </div>
  );
}
