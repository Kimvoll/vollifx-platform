"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgeDollarSign,
  Bell,
  ChartPie,
  ChevronDown,
  CreditCard,
  Home,
  Landmark,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Wallet,
  WalletCards
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/dashboard/protected-route";
import { ThemeToggle } from "@/components/theme-toggle";
import { authHeaders, clearMockSession, getMockSession, type MockUser } from "@/lib/auth";
import { notifications } from "@/lib/dashboard-data";

const nav = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/pools", label: "Pools", icon: Landmark },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: ChartPie },
  { href: "/dashboard/deposit", label: "Deposit", icon: CreditCard },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: Wallet },
  { href: "/dashboard/transactions", label: "Transactions", icon: WalletCards },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/kyc", label: "KYC", icon: ShieldCheck },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/admin", label: "Admin", icon: SlidersHorizontal }
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);
  const [balance, setBalance] = useState("$0.00");
  const [liveNotifications, setLiveNotifications] = useState<string[]>(notifications);

  useEffect(() => {
    setUser(getMockSession()?.user ?? null);
    async function loadAccount() {
      const [profileResponse, notificationResponse] = await Promise.all([
        fetch("/api/profile", { headers: authHeaders() }),
        fetch("/api/notifications", { headers: authHeaders() })
      ]);
      const profileData = await profileResponse.json().catch(() => ({}));
      const notificationData = await notificationResponse.json().catch(() => ({}));
      if (profileResponse.ok) setBalance(profileData.availableBalance || "$0.00");
      if (notificationResponse.ok && notificationData.notifications?.length) {
        setLiveNotifications(notificationData.notifications.map((item: any) => `${item.title}: ${item.message}`));
      }
    }
    loadAccount();
    const timer = window.setInterval(loadAccount, 15000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleNav = nav.filter((item) => item.href !== "/dashboard/admin" || user?.role === "admin");
  const initials = (user?.name || "New Member").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  const logout = () => {
    clearMockSession();
    router.replace("/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-ink text-white light:bg-slate-50 light:text-slate-950">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-black/45 p-5 backdrop-blur-xl light:border-slate-200 light:bg-white/90 lg:block">
          <Link className="flex items-center gap-3" href="/dashboard">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-emeraldx/30 bg-emeraldx/10 text-sm font-black text-emeraldx">VF</span>
            <span>
              <span className="block text-lg font-black tracking-wide">VOLLIFX</span>
              <span className="text-xs uppercase tracking-[0.25em] text-goldx">Investor Portal</span>
            </span>
          </Link>
          <nav className="mt-8 grid gap-2">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition hover:bg-emeraldx/10 hover:text-emeraldx ${active ? "bg-emeraldx/12 text-emeraldx" : "text-slate-400 light:text-slate-600"}`} href={item.href} key={item.href}>
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
          </nav>
          <button className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-rose-400 hover:text-rose-300 light:border-slate-200 light:text-slate-700" onClick={logout} type="button">
            <LogOut size={17} /> Logout
          </button>
        </aside>

        <div className="lg:pl-72">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/82 px-4 py-4 backdrop-blur-xl light:border-slate-200 light:bg-white/85 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-goldx">Account Balance</p>
                <p className="mt-1 text-xl font-black">{balance}</p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <div className="relative">
                  <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 light:border-slate-200 light:bg-white" onClick={() => setOpen((value) => !value)} type="button">
                    <Bell size={18} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emeraldx" />
                  </button>
                  {open ? (
                    <div className="absolute right-0 mt-3 w-80 rounded-lg border border-white/10 bg-obsidian p-3 shadow-2xl light:border-slate-200 light:bg-white">
                      <div className="flex items-center justify-between px-2 py-2">
                        <p className="font-black">Notifications</p>
                        <ChevronDown size={16} />
                      </div>
                      <div className="grid gap-2">
                        {liveNotifications.map((item) => (
                          <div className="rounded-lg bg-white/6 p-3 text-sm text-slate-300 light:bg-slate-100 light:text-slate-700" key={item}>{item}</div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/8 py-1.5 pl-2 pr-4 light:border-slate-200 light:bg-white sm:flex">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emeraldx text-xs font-black text-ink">{initials}</span>
                  <span className="text-sm font-bold">{user?.name || "New Member"}</span>
                </div>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 light:border-slate-200 light:bg-white lg:hidden" onClick={() => setMobileMenu((value) => !value)} type="button">
                  <Menu size={18} />
                </button>
                <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-300 transition hover:border-rose-400 hover:text-rose-300 light:border-slate-200 light:bg-white light:text-slate-700 sm:inline-flex" onClick={logout} type="button">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
            {mobileMenu ? (
              <div className="mt-4 grid max-h-[60vh] gap-2 overflow-y-auto rounded-lg border border-white/10 bg-black/70 p-3 light:border-slate-200 light:bg-white lg:hidden">
                {visibleNav.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold ${active ? "bg-emeraldx/12 text-emeraldx" : "text-slate-400 light:text-slate-600"}`} href={item.href} key={item.href} onClick={() => setMobileMenu(false)}>
                      <Icon size={18} /> {item.label}
                    </Link>
                  );
                })}
                <button className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-rose-300 light:border-slate-200" onClick={logout} type="button">
                  <LogOut size={17} /> Logout
                </button>
              </div>
            ) : null}
          </header>

          <div className="px-4 pb-24 pt-6 sm:px-6 lg:pb-10">{children}</div>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-white/10 bg-black/85 px-2 py-2 backdrop-blur-xl light:border-slate-200 light:bg-white/95 lg:hidden">
          {visibleNav.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link className={`flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-bold ${active ? "text-emeraldx" : "text-slate-400 light:text-slate-600"}`} href={item.href} key={item.href}>
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </ProtectedRoute>
  );
}
