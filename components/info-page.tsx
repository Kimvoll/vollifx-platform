export function InfoPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black text-white light:text-slate-950">{title}</h1>
        <div className="glass mt-8 rounded-lg p-6 text-sm leading-7 text-slate-300 light:text-slate-700">{children}</div>
      </section>
    </div>
  );
}
