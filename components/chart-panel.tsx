import { chartPoints } from "@/lib/data";

export function ChartPanel() {
  return (
    <div className="glass rounded-lg p-4 shadow-glow sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 light:border-slate-200 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Live Chart</p>
          <h2 className="mt-2 text-xl font-black text-white light:text-slate-950">GOLD vs US DOLLAR (15m)</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-300 light:text-slate-700">
          {["1m", "5m", "15m", "1h"].map((item) => (
            <span className={`rounded-full px-3 py-1.5 ${item === "15m" ? "bg-emeraldx text-ink" : "bg-white/8 light:bg-slate-100"}`} key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="chart-grid relative mt-6 h-72 overflow-hidden rounded-lg border border-white/10 bg-black/30 light:border-slate-200 light:bg-slate-50 sm:h-96">
        <div className="absolute inset-x-0 bottom-0 h-[76%] bg-gradient-to-t from-emeraldx/22 to-transparent clip-chart" />
        <div className="absolute left-0 top-[19%] h-0.5 w-full animate-pulseLine bg-emeraldx/50" />
        <div className="absolute left-0 right-0 top-[18%] h-1 rounded-full bg-emeraldx shadow-glow" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-slate-500">
          {chartPoints.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
        <div className="absolute right-4 top-4 grid gap-2 text-right text-xs text-slate-400">
          {chartPoints.slice().reverse().map((point) => (
            <span key={point.price}>{point.price}</span>
          ))}
        </div>
        <div className="absolute right-7 top-[14%] rounded bg-emeraldx px-3 py-1 text-xs font-black text-ink">2417.80</div>
      </div>
    </div>
  );
}
