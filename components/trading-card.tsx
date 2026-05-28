import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type TradingCardProps = {
  symbol: string;
  name: string;
  price: string;
  change: string;
  up: boolean;
};

export function TradingCard({ symbol, name, price, change, up }: TradingCardProps) {
  const Icon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="glass rounded-lg p-5 transition duration-300 hover:-translate-y-1 hover:border-emeraldx/40 hover:shadow-glow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xl font-black text-white light:text-slate-950">{symbol}</p>
          <p className="mt-1 text-sm text-slate-400 light:text-slate-600">{name}</p>
        </div>
        <span className={`rounded-full p-2 ${up ? "bg-emeraldx/12 text-emeraldx" : "bg-rose-500/12 text-rose-400"}`}>
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-8 flex items-end justify-between">
        <p className="text-2xl font-black">{price}</p>
        <p className={`text-sm font-bold ${up ? "text-emeraldx" : "text-rose-400"}`}>{change}</p>
      </div>
    </div>
  );
}
