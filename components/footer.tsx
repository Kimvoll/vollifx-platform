import Link from "next/link";

const groups = [
  {
    title: "Resources",
    links: [
      ["FAQs", "/faq"],
      ["Documentation", "/documentation"],
      ["Trading Rules", "/trading-rules"]
    ]
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/privacy-policy"],
      ["Terms & Conditions", "/terms"],
      ["Risk Disclosure", "/risk-disclosure"]
    ]
  },
  {
    title: "Connect",
    links: [
      ["WhatsApp", "https://wa.me/"],
      ["Telegram", "https://t.me/"],
      ["Instagram", "https://instagram.com/"],
      ["Facebook", "https://facebook.com/"]
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/45 px-4 py-14 light:border-slate-200 light:bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_2fr]">
        <div>
          <Link className="text-2xl font-black tracking-wide" href="/">
            VOLLI FX
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400 light:text-slate-600">
            Professional capital allocation and trading performance management.
          </p>
          <p className="mt-6 rounded-lg border border-goldx/25 bg-goldx/10 p-4 text-xs leading-5 text-slate-300 light:text-slate-700">
            Trading involves substantial risk and is not suitable for every investor.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-goldx">{group.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400 light:text-slate-600">
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <a className="transition hover:text-emeraldx" href={href}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-slate-500 light:border-slate-200">
        Copyright: © 2025 VOLLIFX™. All Rights Reserved.
      </div>
    </footer>
  );
}
