"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/75 backdrop-blur-xl light:border-slate-200 light:bg-white/80">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-emeraldx/30 bg-emeraldx/10 text-sm font-black text-emeraldx shadow-glow">
            VF
          </span>
          <span>
            <span className="block text-lg font-black tracking-wide">VOLLI FX</span>
            <span className="block text-xs uppercase tracking-[0.28em] text-goldx">Institutional</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              className={`text-sm font-medium transition hover:text-emeraldx ${
                pathname === link.href ? "text-emeraldx" : "text-slate-300 light:text-slate-700"
              }`}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link className="rounded-full px-4 py-2 text-sm font-semibold text-slate-200 transition hover:text-emeraldx light:text-slate-700" href="/login">
            Login
          </Link>
          <Link className="rounded-full bg-emeraldx px-5 py-2.5 text-sm font-bold text-ink shadow-glow transition hover:-translate-y-0.5 hover:bg-white" href="/register">
            Register
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 light:border-slate-200 light:bg-white"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-ink/95 px-4 py-5 shadow-2xl light:border-slate-200 light:bg-white md:hidden">
          <div className="mx-auto grid max-w-7xl gap-3">
            {[...links, { href: "/login", label: "Login" }, { href: "/register", label: "Register" }].map((link) => (
              <Link
                className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/8 hover:text-emeraldx light:text-slate-800 light:hover:bg-slate-100"
                href={link.href}
                key={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
