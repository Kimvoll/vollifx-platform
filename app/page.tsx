import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDollarSign, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { ChartPanel } from "@/components/chart-panel";
import { ExchangeTerminal, MiniResultStrip } from "@/components/exchange-terminal";
import { MarketTicker } from "@/components/market-ticker";
import { RiskWarning } from "@/components/risk-warning";
import { SectionHeading } from "@/components/section-heading";
import { TradingCard } from "@/components/trading-card";
import { compliance, features, steps, tradingCards } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-emeraldx/12 blur-3xl" />
        <div className="absolute right-[-12rem] top-24 h-[28rem] w-[28rem] rounded-full bg-goldx/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emeraldx/25 bg-emeraldx/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emeraldx">
              <Sparkles size={15} />
              Private exchange for capital allocators
            </div>
            <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[0.96] tracking-tight text-white light:text-slate-950 sm:text-6xl lg:text-7xl">
              Trade Pools. Live Results. Institutional Execution.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 light:text-slate-700">
              VOLLIFX blends forex exchange infrastructure with managed investment pools, real-time market intelligence, and disciplined risk controls for serious capital growth.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-2 rounded-full bg-emeraldx px-6 py-4 text-sm font-black text-ink shadow-glow transition hover:-translate-y-1 hover:bg-white" href="/register">
                Enter Exchange <ArrowRight size={18} />
              </Link>
              <a className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:border-goldx hover:text-goldx light:border-slate-300 light:text-slate-950" href="#performance">
                View Results
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["5x", "Gold weekly"],
                ["5-10x", "USOIL/NAS100"],
                ["$750", "Minimum"]
              ].map(([value, label]) => (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 light:border-slate-200 light:bg-white" key={label}>
                  <p className="text-2xl font-black text-emeraldx">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <ExchangeTerminal />
        </div>
      </section>

      <MarketTicker />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <MiniResultStrip />
        </div>
      </section>

      <section className="section-pad" id="performance">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <ChartPanel />
          <div className="grid gap-4">
            <div className="glass rounded-lg p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emeraldx/10 text-emeraldx">
                  <Zap size={24} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-goldx">Execution Desk</p>
                  <h2 className="text-xl font-black">Forex Results Engine</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                {["Live gold pool tracking with 15m market context", "USOIL and NAS100 momentum desk with weekly settlement", "Risk-first allocation controls before every pool entry", "Transparent performance history ready for investor review"].map((item) => (
                  <p className="rounded-lg bg-white/6 p-4 text-sm text-slate-300 light:bg-slate-100 light:text-slate-700" key={item}>{item}</p>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {tradingCards.map((card) => (
                <TradingCard key={card.symbol} {...card} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/[0.025] light:bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeading centered eyebrow="Platform Edge" title="Why Choose VOLLIFX?" text="Built for traders who need transparent allocation workflows, performance visibility, and a serious risk-first operating model." />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div className="glass rounded-lg p-6 transition hover:-translate-y-1 hover:border-emeraldx/40" key={feature.title}>
                  <Icon className="text-emeraldx" size={28} />
                  <h3 className="mt-5 text-lg font-black text-white light:text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Live Pools" title="Exchange-Style Access to Managed Markets" text="Two focused VOLLIFX pools, built around the markets traders watch every day: gold, oil, and the NASDAQ index." />
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {[
              ["Gold Pool", "XAU/USD liquidity strategy", "5x weekly capital return", "Managed by Volli"],
              ["USOIL & NAS100 Pool", "Energy and index momentum", "5-10x weekly capital return", "Managed by Volli"]
            ].map(([title, subtitle, result, manager]) => (
              <div className="glass group relative overflow-hidden rounded-lg p-6 transition hover:-translate-y-1 hover:border-emeraldx/40 hover:shadow-glow" key={title}>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emeraldx via-goldx to-emeraldx opacity-70" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-goldx">{subtitle}</p>
                    <h3 className="mt-3 text-3xl font-black text-white light:text-slate-950">{title}</h3>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emeraldx/10 text-emeraldx transition group-hover:scale-110">
                    <CircleDollarSign size={25} />
                  </span>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {[result, "$750 minimum", manager].map((item) => (
                    <p className="rounded-lg bg-white/6 p-4 text-sm font-bold text-slate-200 light:bg-slate-100 light:text-slate-700" key={item}>{item}</p>
                  ))}
                </div>
                <Link className="mt-6 inline-flex items-center gap-2 text-sm font-black text-emeraldx" href="/register">
                  Join Pool <ArrowRight size={17} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Capital Flow" title="How It Works" text="A clean four-step path from onboarding to active performance management." />
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div className="glass rounded-lg p-6" key={step}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emeraldx text-sm font-black text-ink">0{index + 1}</span>
                <h3 className="mt-6 text-lg font-black text-white light:text-slate-950">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/[0.025] light:bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeading centered eyebrow="Compliance" title="Global Regulatory Compliance" text="VOLLIFX is designed around the operational standards expected from serious financial technology platforms." />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {compliance.map((item) => (
              <div className="glass rounded-lg p-6 text-center" key={item.name}>
                <ShieldCheck className="mx-auto text-goldx" size={32} />
                <h3 className="mt-5 text-2xl font-black text-white light:text-slate-950">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">{item.text}</p>
                <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-emeraldx/10 px-3 py-1 text-xs font-bold text-emeraldx">
                  <CheckCircle2 size={14} /> Framework Ready
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RiskWarning />
    </>
  );
}
