"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Copy, CreditCard, ShieldCheck, Upload, Wallet } from "lucide-react";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { authHeaders } from "@/lib/auth";

const btcWallet = "bc1q9fmvaulvhfgylprs65c736pztper3wun7tnews";
const usdtWallet = "0xcD023Df55D674142ecd8DA74AeB898Fa6F6cfF2c";

const depositMethods = [
  { id: "BTC", label: "Bitcoin", icon: Wallet, network: "BTC" },
  { id: "USDT ERC20", label: "USDT ERC20", icon: Wallet, network: "Ethereum ERC20" },
  { id: "Card / Pesapal", label: "Card Payment", icon: CreditCard, network: "Coming Soon", disabled: true }
];

const withdrawMethods = [
  { id: "PayPal", label: "PayPal", icon: CreditCard },
  { id: "Crypto", label: "Crypto", icon: Wallet }
];

type PaymentResult = {
  checkoutUrl?: string;
  message?: string;
  payment?: {
    id: string;
    wallet?: string;
    asset?: string;
    status: string;
  };
};

export function FundingForm({ type }: { type: "Deposit" | "Withdrawal" }) {
  const isDeposit = type === "Deposit";
  const methods = isDeposit ? depositMethods : withdrawMethods;
  const [method, setMethod] = useState(methods[0].id);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<PaymentResult | null>(null);
  const [proof, setProof] = useState("");
  const [proofName, setProofName] = useState("");
  const [copied, setCopied] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "KE"
  });
  const [withdrawal, setWithdrawal] = useState({
    paypalEmail: "",
    wallet: "",
    network: "USDT ERC20"
  });

  const numericAmount = Number(amount.replace(/[^0-9.]/g, "")) || 0;
  const selectedDeposit = depositMethods.find((item) => item.id === method);
  const isCryptoDeposit = method === "BTC" || method === "USDT ERC20";
  const wallet = method === "BTC" ? btcWallet : method === "USDT ERC20" ? usdtWallet : payment?.payment?.wallet || "";
  const qrValue = wallet ? `${method}:${wallet}?amount=${numericAmount || ""}` : "";
  const qrUrl = qrValue ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=14&data=${encodeURIComponent(qrValue)}` : "";

  useEffect(() => {
    setMessage("");
    setError("");
    setPayment(null);
    setProof("");
    setProofName("");
  }, [method, type]);

  async function prepareDeposit() {
    setLoading(true);
    setError("");
    setMessage("");
    if (method === "Card / Pesapal") {
      setMessage("Card payments are coming soon. Please use BTC or USDT ERC20 for deposits right now.");
      setLoading(false);
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid deposit amount.");
      setLoading(false);
      return;
    }
    const endpoint = isCryptoDeposit ? "/api/payments/crypto" : "/api/payments/pesapal/initiate";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        amount: numericAmount,
        poolId: "wallet-deposit",
        poolName: "VOLLIFX Wallet Deposit",
        asset: method === "BTC" ? "BTC" : "USDT_ERC20",
        ...customer
      })
    });
    const data = await response.json();
    setPayment(data);
    setMessage(data.message || `${selectedDeposit?.label || method} payment prepared.`);
    if (!response.ok) setError(data.message || "Payment could not be prepared.");
    setLoading(false);
  }

  async function submitDeposit() {
    setLoading(true);
    setError("");
    if (!payment?.payment?.id && !payment?.checkoutUrl) {
      setError("Prepare the payment first, then submit it for review.");
      setLoading(false);
      return;
    }
    if (!proof) {
      setError("Upload a payment proof screenshot before submitting.");
      setLoading(false);
      return;
    }
    const response = await fetch("/api/transactions/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        amount: numericAmount,
        method,
        network: selectedDeposit?.network || method,
        wallet,
        paymentId: payment.payment?.id,
        proofUrl: proof,
        asset: method === "BTC" ? "BTC" : method === "USDT ERC20" ? "USDT_ERC20" : "CARD",
        customer
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Deposit could not be submitted.");
    } else {
      setMessage(data.message || "Deposit submitted for admin review.");
      setRefreshKey((value) => value + 1);
    }
    setLoading(false);
  }

  async function submitWithdrawal() {
    setLoading(true);
    setError("");
    setMessage("");
    const destination = method === "PayPal" ? withdrawal.paypalEmail : withdrawal.wallet;
    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid withdrawal amount.");
      setLoading(false);
      return;
    }
    if (!destination) {
      setError(method === "PayPal" ? "Enter your PayPal email." : "Enter your crypto wallet address.");
      setLoading(false);
      return;
    }
    const response = await fetch("/api/transactions/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        method,
        amount: numericAmount,
        destination,
        paypalEmail: withdrawal.paypalEmail,
        wallet: withdrawal.wallet,
        network: method === "Crypto" ? withdrawal.network : "PayPal"
      })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Withdrawal could not be submitted.");
    } else {
      setMessage(data.message || `${data.transaction.type} ${data.transaction.id} is ${data.transaction.status}.`);
      setRefreshKey((value) => value + 1);
    }
    setLoading(false);
  }

  async function handleProof(file?: File) {
    if (!file) return;
    if (file.size > 900_000) {
      setError("Please upload a proof image under 900KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProof(String(reader.result || ""));
      setProofName(file.name);
      setError("");
    };
    reader.readAsDataURL(file);
  }

  const steps = useMemo(() => isDeposit
    ? ["Select route", "Prepare payment", "Upload proof", "Admin review"]
    : ["Choose payout", "Enter destination", "Reserve balance", "Admin decision"], [isDeposit]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
      <div className="glass rounded-lg p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">{type} System</p>
            <h1 className="mt-2 text-3xl font-black">{type} Funds</h1>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emeraldx/30 bg-emeraldx/10 px-3 py-2 text-xs font-black text-emeraldx">
            <ShieldCheck size={15} /> Secure Review
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 light:border-slate-200 light:bg-white" key={step}>
              <p className="text-xs font-black text-emeraldx">0{index + 1}</p>
              <p className="mt-1 text-xs font-bold text-slate-300 light:text-slate-700">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {methods.map((item: any) => {
            const Icon = item.icon;
            return (
              <button className={`rounded-lg border px-4 py-4 text-left text-sm font-bold transition ${item.disabled ? "cursor-not-allowed border-goldx/25 bg-goldx/10 text-goldx" : `hover:-translate-y-1 ${method === item.id ? "border-emeraldx bg-emeraldx/10 text-emeraldx shadow-glow" : "border-white/10 bg-white/5 text-slate-300 light:border-slate-200 light:bg-white light:text-slate-700"}`}`} disabled={item.disabled} key={item.id} onClick={() => setMethod(item.id)} type="button">
                <Icon className="mb-3" size={20} />
                {item.label}
                {item.network ? <span className="mt-1 block text-xs font-semibold text-slate-500">{item.network}</span> : null}
              </button>
            );
          })}
        </div>

        <label className="mt-6 grid gap-2 text-sm font-bold">
          Amount
          <input className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none transition focus:border-emeraldx light:border-slate-200 light:bg-white" onChange={(event) => setAmount(event.target.value)} placeholder={isDeposit ? "$500.00" : "$0.00"} value={amount} />
        </label>

        {isDeposit ? <div className="mt-5 rounded-lg border border-goldx/25 bg-goldx/10 p-4 text-sm font-bold text-goldx">Card payments are coming soon. Crypto deposits are available now through BTC and USDT ERC20.</div> : null}

        {isDeposit ? (
          <>
            <button className="mt-5 w-full rounded-full bg-emeraldx px-6 py-4 text-sm font-black text-ink shadow-glow transition hover:bg-white disabled:opacity-60" disabled={loading} onClick={prepareDeposit} type="button">
              {loading ? "Preparing..." : "Generate Wallet Payment"}
            </button>

            {payment || (isCryptoDeposit && numericAmount > 0) ? (
              <div className="mt-5 grid gap-4 rounded-lg border border-white/10 bg-white/5 p-4 light:border-slate-200 light:bg-white">
                {payment?.checkoutUrl ? (
                  <a className="inline-flex justify-center rounded-full border border-goldx/30 px-5 py-3 text-sm font-black text-goldx transition hover:bg-goldx/10" href={payment.checkoutUrl} rel="noreferrer" target="_blank">
                    Pay Securely with Pesapal
                  </a>
                ) : null}
                {wallet ? (
                  <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                    <img alt={`${method} QR code`} className="rounded-lg border border-white/10 bg-white p-3" src={qrUrl} />
                    <div className="grid content-start gap-3">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-goldx">{method} payment address</p>
                      <p className="break-all rounded-lg bg-black/30 p-3 text-sm font-bold text-white light:bg-slate-100 light:text-slate-950">{wallet}</p>
                      <button className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 transition hover:border-emeraldx hover:text-emeraldx light:border-slate-200 light:text-slate-700" onClick={async () => {
                        await navigator.clipboard.writeText(wallet);
                        setCopied("Wallet copied");
                      }} type="button">
                        <Copy size={14} /> {copied || "Copy Address"}
                      </button>
                    </div>
                  </div>
                ) : null}
                <label className="grid gap-2 text-sm font-bold">
                  Upload payment proof
                  <span className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-emeraldx/40 bg-emeraldx/10 px-4 py-5 text-sm text-emeraldx transition hover:bg-emeraldx/15">
                    <Upload size={18} /> {proofName || "Choose screenshot or receipt"}
                    <input accept="image/*" className="hidden" onChange={(event) => handleProof(event.target.files?.[0])} type="file" />
                  </span>
                </label>
                {proof ? <img alt="Payment proof preview" className="max-h-52 rounded-lg border border-white/10 object-contain" src={proof} /> : null}
                <button className="rounded-full border border-emeraldx/40 px-5 py-3 text-sm font-black text-emeraldx transition hover:bg-emeraldx/10 disabled:opacity-60" disabled={loading} onClick={submitDeposit} type="button">
                  Submit Deposit for Admin Verification
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <>
            {method === "PayPal" ? (
              <label className="mt-5 grid gap-2 text-sm font-bold">
                PayPal email
                <input className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emeraldx light:border-slate-200 light:bg-white" onChange={(event) => setWithdrawal((value) => ({ ...value, paypalEmail: event.target.value }))} placeholder="paypal@example.com" type="email" value={withdrawal.paypalEmail} />
              </label>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-[0.7fr_1.3fr]">
                <label className="grid gap-2 text-sm font-bold">
                  Network
                  <select className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emeraldx light:border-slate-200 light:bg-white" onChange={(event) => setWithdrawal((value) => ({ ...value, network: event.target.value }))} value={withdrawal.network}>
                    <option>USDT ERC20</option>
                    <option>BTC</option>
                    <option>USDT TRC20</option>
                    <option>ETH</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  Wallet address
                  <input className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none focus:border-emeraldx light:border-slate-200 light:bg-white" onChange={(event) => setWithdrawal((value) => ({ ...value, wallet: event.target.value }))} placeholder="Paste receiving wallet" value={withdrawal.wallet} />
                </label>
              </div>
            )}
            <button className="mt-5 w-full rounded-full bg-emeraldx px-6 py-4 text-sm font-black text-ink shadow-glow transition hover:bg-white disabled:opacity-60" disabled={loading} onClick={submitWithdrawal} type="button">
              {loading ? "Submitting..." : "Submit Withdrawal Request"}
            </button>
          </>
        )}

        {error ? <div className="mt-5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm font-bold text-rose-300">{error}</div> : null}
        {message ? (
          <div className="mt-5 rounded-lg border border-emeraldx/30 bg-emeraldx/10 p-4 text-sm text-emeraldx">
            <CheckCircle2 className="mb-2" /> {message}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-goldx/25 bg-goldx/10 p-4 text-sm text-goldx">
            <Clock3 className="mb-2" /> {isDeposit ? "Deposits stay Pending Review until admin confirms the payment proof." : "Withdrawal funds are reserved immediately and released or returned after admin decision."}
          </div>
        )}
      </div>
      <ActivityTable mode="transactions" refreshKey={refreshKey} />
    </div>
  );
}
