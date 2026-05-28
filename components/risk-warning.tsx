import { AlertTriangle } from "lucide-react";

export function RiskWarning() {
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto max-w-7xl rounded-lg border border-goldx/30 bg-goldx/10 p-6 shadow-gold light:bg-amber-50">
        <div className="flex flex-col gap-4 sm:flex-row">
          <AlertTriangle className="shrink-0 text-goldx" size={28} />
          <div>
            <h2 className="text-lg font-black text-white light:text-slate-950">Risk Warning</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300 light:text-slate-700">
              Forex, CFD, commodities, indices, and digital asset trading involve substantial risk and may not be suitable for every investor. Past performance does not guarantee future results. Only trade with capital you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
