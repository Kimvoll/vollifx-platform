"use client";

import { Copy, CreditCard, Wallet } from "lucide-react";
import { useState } from "react";
import { authHeaders } from "@/lib/auth";

type PaymentState = {
  checkoutUrl?: string;
  message?: string;
  payment?: {
    id: string;
    wallet?: string;
    asset?: string;
    status: string;
  };
};

export function JoinPoolButton({ poolId, className, minimum = "$500" }: { poolId: string; className: string; minimum?: string }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<"card" | "BTC" | "USDT_ERC20">("BTC");
  const [payment, setPayment] = useState<PaymentState | null>(null);
  const [copied, setCopied] = useState("");
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "KE"
  });

  const amount = Number(minimum.replace(/[^0-9.]/g, "")) || 500;

  async function startPayment() {
    setLoading(true);
    setStatus("");
    if (method === "card") {
      setStatus("Card payments are coming soon. Please use BTC or USDT ERC20 for now.");
      setLoading(false);
      return;
    }
    const response = await fetch("/api/payments/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        poolId,
        amount,
        asset: method,
        ...customer
      })
    });
    const data = await response.json();
    setPayment(data);
    setLoading(false);
  }

  async function submitAllocation() {
    setLoading(true);
    const response = await fetch(`/api/pools/${poolId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ paymentId: payment?.payment?.id, amount })
    });
    const data = await response.json();
    setStatus(data.message);
    setLoading(false);
  }

  return (
    <div>
      <button
        className={className}
        disabled={loading}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        Join Pool
      </button>
      {open ? (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/25 p-4 light:border-slate-200 light:bg-white">
          <p className="text-sm font-black text-white light:text-slate-950">Payment Required</p>
          <p className="mt-2 text-sm leading-6 text-slate-400 light:text-slate-600">
            Members must complete the minimum pool payment of {minimum} before allocation is submitted.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              ["BTC", "BTC", Wallet],
              ["USDT_ERC20", "USDT ERC20", Wallet],
              ["card", "Card Payments Coming Soon", CreditCard]
            ].map(([value, label, Icon]: any) => (
              <button
                className={`rounded-lg border px-3 py-3 text-left text-sm font-bold transition ${value === "card" ? "cursor-not-allowed border-goldx/25 bg-goldx/10 text-goldx" : method === value ? "border-emeraldx bg-emeraldx/10 text-emeraldx" : "border-white/10 bg-white/5 text-slate-300 light:border-slate-200 light:bg-slate-100 light:text-slate-700"}`}
                disabled={value === "card"}
                key={value}
                onClick={() => {
                  setMethod(value);
                  setPayment(null);
                }}
                type="button"
              >
                <Icon className="mb-2" size={18} /> {label}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-goldx/25 bg-goldx/10 p-4 text-sm font-bold text-goldx">
            Card payments are coming soon. Pool payments are currently available by BTC and USDT ERC20.
          </div>
          <button className="mt-4 w-full rounded-full bg-emeraldx px-5 py-3 text-sm font-black text-ink shadow-glow transition hover:bg-white" disabled={loading} onClick={startPayment} type="button">
            {loading ? "Preparing Payment..." : "Continue to Payment"}
          </button>

          {payment?.checkoutUrl ? (
            <a className="mt-4 inline-flex w-full justify-center rounded-full border border-goldx/30 px-5 py-3 text-sm font-black text-goldx transition hover:bg-goldx/10" href={payment.checkoutUrl}>
              Pay Securely with Pesapal
            </a>
          ) : null}

          {payment?.payment?.wallet ? (
            <div className="mt-4 rounded-lg bg-white/6 p-4 light:bg-slate-100">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-goldx">{payment.payment.asset} wallet</p>
              <p className="mt-2 break-all text-sm font-bold text-white light:text-slate-950">{payment.payment.wallet}</p>
              <button
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-emeraldx hover:text-emeraldx light:border-slate-200 light:text-slate-700"
                onClick={async () => {
                  await navigator.clipboard.writeText(payment.payment?.wallet || "");
                  setCopied("Wallet copied");
                }}
                type="button"
              >
                <Copy size={14} /> {copied || "Copy Address"}
              </button>
            </div>
          ) : null}

          {payment ? (
            <button className="mt-4 w-full rounded-full border border-emeraldx/40 px-5 py-3 text-sm font-black text-emeraldx transition hover:bg-emeraldx/10" disabled={loading} onClick={submitAllocation} type="button">
              I Have Paid, Submit Allocation
            </button>
          ) : null}

          {payment?.message ? <p className="mt-3 text-xs text-slate-400 light:text-slate-600">{payment.message}</p> : null}
        </div>
      ) : null}
      {status ? <p className="mt-3 rounded-lg bg-emeraldx/10 p-3 text-sm font-bold text-emeraldx">{status}</p> : null}
    </div>
  );
}
