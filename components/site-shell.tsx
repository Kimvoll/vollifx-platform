"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-ink text-white transition-colors duration-300 light:bg-slate-50 light:text-slate-950">
      {!isDashboard ? mounted ? <Navbar /> : <div className="fixed inset-x-0 top-0 z-50 h-20 border-b border-white/10 bg-ink/75 light:border-slate-200 light:bg-white/80" /> : null}
      <main>{children}</main>
      {!isDashboard && mounted ? <Footer /> : null}
    </div>
  );
}
