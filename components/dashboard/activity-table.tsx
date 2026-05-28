"use client";

import { useEffect, useState } from "react";
import { activity, transactions as seedTransactions } from "@/lib/dashboard-data";
import { authHeaders } from "@/lib/auth";

const statusStyles: Record<string, string> = {
  Approved: "bg-emeraldx/10 text-emeraldx border-emeraldx/30",
  "Pending Review": "bg-goldx/10 text-goldx border-goldx/30",
  Pending: "bg-goldx/10 text-goldx border-goldx/30",
  Processing: "bg-sky-500/10 text-sky-300 border-sky-400/30",
  Rejected: "bg-rose-500/10 text-rose-300 border-rose-400/30"
};

export function ActivityTable({ mode = "activity", refreshKey = 0 }: { mode?: "activity" | "transactions"; refreshKey?: number }) {
  const [rows, setRows] = useState<any[]>(mode === "activity" ? activity : seedTransactions);
  const [loading, setLoading] = useState(mode === "transactions");

  useEffect(() => {
    if (mode !== "transactions") return;
    let active = true;
    async function loadTransactions() {
      setLoading(true);
      const response = await fetch("/api/transactions", { headers: authHeaders() });
      const data = await response.json().catch(() => ({}));
      if (active && response.ok) setRows(data.transactions || []);
      if (active) setLoading(false);
    }
    loadTransactions();
    const timer = window.setInterval(loadTransactions, 12000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [mode, refreshKey]);

  return (
    <div className="glass overflow-hidden rounded-lg">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 light:border-slate-200">
        <h2 className="text-lg font-black text-white light:text-slate-950">{mode === "activity" ? "Recent Activity" : "Transaction History"}</h2>
        {mode === "transactions" ? <span className="rounded-full bg-emeraldx/10 px-3 py-1 text-xs font-black text-emeraldx">{loading ? "Syncing" : "Live"}</span> : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-slate-500 light:bg-slate-100">
            <tr>
              {(mode === "activity" ? ["Type", "Detail", "Amount", "Status", "Time"] : ["ID", "Method", "Type", "Amount", "Status", "Network", "Date"]).map((head) => (
                <th className="px-5 py-4" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 light:divide-slate-200">
            {rows.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-center text-slate-400 light:text-slate-600" colSpan={mode === "activity" ? 5 : 7}>
                  {mode === "activity" ? "No activity yet. Your deposits, withdrawals, and pool allocations will appear here." : "No transactions yet. Make a deposit to start your account history."}
                </td>
              </tr>
            ) : rows.map((row: any) => mode === "activity" ? (
              <tr className="transition hover:bg-white/5" key={row.id ?? row.detail}>
                {Object.values(row).map((value) => (
                  <td className="px-5 py-4 text-slate-300 light:text-slate-700" key={String(value)}>{String(value)}</td>
                ))}
              </tr>
            ) : (
              <tr className="transition hover:bg-white/5" key={row.id}>
                <td className="px-5 py-4 font-mono text-xs text-slate-400">{String(row.id).slice(0, 8)}</td>
                <td className="px-5 py-4 text-slate-300 light:text-slate-700">{row.method}</td>
                <td className="px-5 py-4 text-slate-300 light:text-slate-700">{row.type}</td>
                <td className="px-5 py-4 font-black text-white light:text-slate-950">{row.amount}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyles[row.status] || "border-white/10 bg-white/5 text-slate-300"}`}>{row.status}</span>
                </td>
                <td className="px-5 py-4 text-slate-300 light:text-slate-700">{row.network || "-"}</td>
                <td className="px-5 py-4 text-slate-400">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
