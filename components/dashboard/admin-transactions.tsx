"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Eye, Search, XCircle } from "lucide-react";
import { authHeaders } from "@/lib/auth";

const statusStyles: Record<string, string> = {
  Approved: "bg-emeraldx/10 text-emeraldx border-emeraldx/30",
  "Pending Review": "bg-goldx/10 text-goldx border-goldx/30",
  Pending: "bg-goldx/10 text-goldx border-goldx/30",
  Processing: "bg-sky-500/10 text-sky-300 border-sky-400/30",
  Rejected: "bg-rose-500/10 text-rose-300 border-rose-400/30"
};

type AdminTransaction = {
  id: string;
  userName: string;
  userEmail: string;
  method: string;
  type: string;
  amount: string;
  status: string;
  network: string;
  destination: string;
  proofUrl: string;
  date: string;
};

export function AdminTransactions() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [totals, setTotals] = useState({ deposits: "$0.00", withdrawals: "$0.00", pending: "$0.00" });
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [proof, setProof] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTransactions = useCallback(async (nextQuery = query) => {
    setLoading(true);
    const response = await fetch(`/api/admin/transactions${nextQuery ? `?q=${encodeURIComponent(nextQuery)}` : ""}`, { headers: authHeaders() });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setTransactions(data.transactions || []);
      setTotals(data.totals || { deposits: "$0.00", withdrawals: "$0.00", pending: "$0.00" });
    } else {
      setMessage(data.message || "Could not load admin transactions.");
    }
    setLoading(false);
  }, [query]);

  async function review(id: string, action: "approve" | "reject" | "processing") {
    const response = await fetch("/api/admin/transactions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ id, action })
    });
    const data = await response.json().catch(() => ({}));
    setMessage(data.message || "Transaction updated.");
    await loadTransactions();
  }

  useEffect(() => {
    loadTransactions("");
    const timer = window.setInterval(() => loadTransactions(query), 10000);
    return () => window.clearInterval(timer);
  }, [loadTransactions, query]);

  return (
    <div className="glass rounded-lg p-5">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 light:border-slate-200 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-goldx">Live Review Desk</p>
          <h2 className="mt-2 text-xl font-black">Deposits & Withdrawals</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["Approved Deposits", totals.deposits],
            ["Approved Withdrawals", totals.withdrawals],
            ["Pending Balance", totals.pending]
          ].map(([label, value]) => (
            <div className="rounded-lg bg-white/6 px-4 py-3 light:bg-slate-100" key={label}>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
              <p className="mt-1 text-lg font-black">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
          <input className="w-full rounded-full border border-white/10 bg-black/25 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emeraldx light:border-slate-200 light:bg-white" onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => {
            if (event.key === "Enter") loadTransactions(query);
          }} placeholder="Search user email, transaction ID, method, or status" value={query} />
        </label>
        <button className="rounded-full bg-emeraldx px-5 py-3 text-sm font-black text-ink shadow-glow transition hover:bg-white" onClick={() => loadTransactions(query)} type="button">
          Search
        </button>
      </div>

      {message ? <div className="mt-4 rounded-lg border border-emeraldx/30 bg-emeraldx/10 p-3 text-sm font-bold text-emeraldx">{message}</div> : null}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-slate-500 light:bg-slate-100">
            <tr>
              {["ID", "User", "Type", "Method", "Amount", "Status", "Destination", "Proof", "Action"].map((head) => (
                <th className="px-4 py-4" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 light:divide-slate-200">
            {loading ? (
              <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={9}>Loading transaction desk...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={9}>No deposits or withdrawals found.</td></tr>
            ) : transactions.map((transaction) => (
              <tr className="transition hover:bg-white/5" key={transaction.id}>
                <td className="px-4 py-4 font-mono text-xs text-slate-400">{transaction.id.slice(0, 8)}</td>
                <td className="px-4 py-4">
                  <p className="font-black text-white light:text-slate-950">{transaction.userName}</p>
                  <p className="text-xs text-slate-500">{transaction.userEmail}</p>
                </td>
                <td className="px-4 py-4 text-slate-300">{transaction.type}</td>
                <td className="px-4 py-4 text-slate-300">{transaction.method}<span className="block text-xs text-slate-500">{transaction.network}</span></td>
                <td className="px-4 py-4 font-black text-white light:text-slate-950">{transaction.amount}</td>
                <td className="px-4 py-4"><span className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyles[transaction.status] || "border-white/10 bg-white/5 text-slate-300"}`}>{transaction.status}</span></td>
                <td className="max-w-[220px] truncate px-4 py-4 text-slate-400">{transaction.destination || "-"}</td>
                <td className="px-4 py-4">
                  {transaction.proofUrl ? (
                    <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 hover:border-emeraldx hover:text-emeraldx" onClick={() => setProof(transaction.proofUrl)} type="button">
                      <Eye size={14} /> View
                    </button>
                  ) : "-"}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button className="rounded-full bg-emeraldx px-3 py-2 text-xs font-black text-ink transition hover:bg-white disabled:opacity-40" disabled={["Approved", "Rejected"].includes(transaction.status)} onClick={() => review(transaction.id, "approve")} type="button">
                      <CheckCircle2 size={14} />
                    </button>
                    <button className="rounded-full border border-rose-400/30 px-3 py-2 text-xs font-black text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-40" disabled={["Approved", "Rejected"].includes(transaction.status)} onClick={() => review(transaction.id, "reject")} type="button">
                      <XCircle size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {proof ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setProof("")}>
          <div className="max-h-[88vh] max-w-3xl rounded-lg border border-white/10 bg-ink p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="font-black">Payment Proof</p>
              <button className="rounded-full border border-white/10 px-3 py-1 text-sm" onClick={() => setProof("")} type="button">Close</button>
            </div>
            <img alt="Uploaded payment proof" className="max-h-[74vh] rounded-lg object-contain" src={proof} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
