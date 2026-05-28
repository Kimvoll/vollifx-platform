import { ArrowDownRight, ArrowUpRight, Gauge, Radio, ShieldCheck } from "lucide-react";

const orderBook = [
  ["2,418.42", "12.40", "Buy"],
  ["2,417.96", "8.20", "Buy"],
  ["2,417.80", "21.70", "Buy"],
  ["2,417.34", "14.10", "Sell"],
  ["2,416.92", "9.85", "Sell"]
];

const candles = [44, 72, 54, 88, 62, 96, 70, 108, 82, 118, 92, 132, 86, 126];

export function ExchangeTerminal() {
  return (
    <div className="glass relative overflow-hidden rounded-lg p-4 shadow-glow">
      <div className="absolute inset-x-0 top-0 h-28 animate-scan bg-gradient-to-b from-emeraldx/0 via-emeraldx/10 to-emeraldx/0" />
      <div className="flex items-center justify-between border-b border-white/10 pb-4 light:border-slate-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Exchange Terminal</p>
          <h2 className="mt-2 text-xl font-black text-white light:text-slate-950">XAU/USD Institutional Pool</h2>
        </div>
        <span className="rounded-full bg-emeraldx/10 px-3 py-1 text-xs font-black text-emeraldx">Live</span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-lg border border-white/10 bg-black/30 p-4 light:border-slate-200 light:bg-slate-50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 light:text-slate-600">Gold Spot</p>
              <p className="mt-1 text-3xl font-black">2,417.80</p>
            </div>
            <div className="text-right">
              <p className="inline-flex items-center gap-1 rounded-full bg-emeraldx/10 px-3 py-1 text-sm font-black text-emeraldx">
                <ArrowUpRight size={15} /> +0.72%
              </p>
              <p className="mt-2 text-xs text-slate-500">15m change</p>
            </div>
          </div>
          <div className="chart-grid relative mt-7 flex h-64 items-end justify-between overflow-hidden rounded-lg px-3 pb-5">
            <div className="absolute left-0 right-0 top-[28%] h-px bg-emeraldx/50" />
            <div className="absolute right-4 top-[23%] rounded bg-emeraldx px-2 py-1 text-xs font-black text-ink">Liquidity zone</div>
            {candles.map((height, index) => {
              const up = index % 3 !== 1;
              return (
                <span
                  className={`relative w-3 origin-bottom animate-candleRise rounded-sm ${up ? "bg-emeraldx shadow-glow" : "bg-rose-400"}`}
                  key={height + index}
                  style={{ height, animationDelay: `${index * 110}ms` }}
                >
                  <span className={`absolute left-1/2 top-[-18px] h-5 w-px -translate-x-1/2 ${up ? "bg-emeraldx/70" : "bg-rose-400/70"}`} />
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-lg border border-white/10 bg-black/30 p-4 light:border-slate-200 light:bg-white">
            <p className="text-sm font-black">Order Flow</p>
            <div className="mt-3 grid gap-2">
              {orderBook.map(([price, size, side]) => (
                <div className="grid grid-cols-3 rounded bg-white/5 px-3 py-2 text-sm light:bg-slate-100" key={`${price}-${side}`}>
                  <span className={side === "Buy" ? "text-emeraldx" : "text-rose-400"}>{price}</span>
                  <span className="text-slate-400">{size}</span>
                  <span className="text-right">{side}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              [Radio, "Execution", "24ms"],
              [Gauge, "Risk", "1.5%"],
              [ShieldCheck, "Uptime", "99.9%"]
            ].map(([Icon, label, value]: any) => (
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center light:border-slate-200 light:bg-white" key={label}>
                <Icon className="mx-auto text-goldx" size={18} />
                <p className="mt-2 text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-black">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MiniResultStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[
        ["Gold Pool Result", "+5x weekly", true],
        ["USOIL/NAS100 Range", "5-10x weekly", true],
        ["Minimum Deposit", "$500", true],
        ["Managed By", "Volli", false]
      ].map(([label, value, good]) => (
        <div className="glass rounded-lg p-5 transition hover:-translate-y-1 hover:border-emeraldx/40" key={label as string}>
          <p className="text-sm text-slate-400 light:text-slate-600">{label}</p>
          <p className={`mt-3 flex items-center gap-2 text-2xl font-black ${good ? "text-emeraldx" : "text-goldx"}`}>
            {good ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />} {value as string}
          </p>
        </div>
      ))}
    </div>
  );
}
