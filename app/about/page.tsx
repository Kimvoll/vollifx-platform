import { LineChart, Shield, Target, UsersRound } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { aboutStats } from "@/lib/data";

const pillars = [
  { icon: Target, title: "Mission", text: "To make institutional-grade trading participation more transparent, disciplined, and accessible through structured capital allocation workflows." },
  { icon: LineChart, title: "Evidence Based", text: "Every decision should be supported by measurable performance data, risk metrics, and accountable trading rules." },
  { icon: Shield, title: "Safety First", text: "Risk controls, client education, and operational clarity sit at the center of the VOLLIFX experience." }
];

export default function AboutPage() {
  return (
    <div className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <SectionHeading centered eyebrow="About VOLLIFX" title="Redefining Institutional Trading Excellence" text="VOLLIFX brings the language of professional desks into a refined trading platform experience for global participants." />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div className="glass rounded-lg p-6" key={pillar.title}>
                <Icon className="text-emeraldx" size={30} />
                <h2 className="mt-5 text-xl font-black text-white light:text-slate-950">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">{pillar.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aboutStats.map(([label, value]) => (
            <div className="glass rounded-lg p-6 text-center" key={label}>
              <p className="text-4xl font-black text-emeraldx">{value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-300 light:text-slate-700">{label}</p>
            </div>
          ))}
        </div>

        <div className="glass mt-16 grid gap-8 rounded-lg p-8 md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-goldx/30 bg-goldx/10 text-goldx">
            <UsersRound size={36} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white light:text-slate-950">Built by Traders, For Traders</h2>
            <p className="mt-4 text-base leading-8 text-slate-400 light:text-slate-600">
              The platform is shaped around the details active traders care about: entry clarity, portfolio exposure, live-market responsiveness, settlement expectations, and direct performance visibility. It is practical, refined, and built for serious capital allocators.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
