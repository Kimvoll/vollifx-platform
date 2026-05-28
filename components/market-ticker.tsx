import { ticker } from "@/lib/data";

export function MarketTicker() {
  const repeated = [...ticker, ...ticker];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.035] py-3 light:border-slate-200 light:bg-white">
      <div className="flex w-max animate-ticker gap-3">
        {repeated.map((item, index) => {
          const positive = item.change.startsWith("+");
          return (
            <div className="glass flex min-w-48 items-center justify-between gap-4 rounded-lg px-4 py-3" key={`${item.symbol}-${index}`}>
              <span className="text-sm font-bold text-white light:text-slate-950">{item.symbol}</span>
              <span className="text-sm text-slate-300 light:text-slate-700">{item.price}</span>
              <span className={`text-xs font-black ${positive ? "text-emeraldx" : "text-rose-400"}`}>{item.change}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
