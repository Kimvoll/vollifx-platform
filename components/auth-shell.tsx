import Link from "next/link";
import { ShieldCheck } from "lucide-react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  sideTitle: string;
  sideText: string;
};

export function AuthShell({ title, subtitle, children, sideTitle, sideText }: AuthShellProps) {
  return (
    <div className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.78fr]">
        <div className="glass rounded-lg p-6 sm:p-8">
          <Link className="text-sm font-bold text-emeraldx" href="/">
            VOLLI FX
          </Link>
          <h1 className="mt-6 text-3xl font-black text-white light:text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400 light:text-slate-600">{subtitle}</p>
          {children}
        </div>
        <aside className="glass flex flex-col justify-between rounded-lg p-8">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-emeraldx/30 bg-emeraldx/10 text-emeraldx shadow-glow">
              <ShieldCheck size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-black text-white light:text-slate-950">{sideTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">{sideText}</p>
          </div>
          <div className="mt-10 rounded-lg border border-goldx/25 bg-goldx/10 p-4 text-xs leading-5 text-slate-300 light:text-slate-700">
            Accounts are protected by secure authentication, role-based access, and investor verification workflows.
          </div>
        </aside>
      </section>
    </div>
  );
}
