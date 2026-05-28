"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { ForgotPasswordAction } from "@/components/forgot-password-action";
import { createMockSession } from "@/lib/auth";

const ADMIN_EMAIL = "vollikip@gmail.com";
const ADMIN_PASSWORDS = ["1209Kip", "1209Kip."];

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    setLoading(true);
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    const isAdmin = normalizedEmail === ADMIN_EMAIL;

    if (isAdmin && !ADMIN_PASSWORDS.includes(password)) {
      setError("Invalid admin password.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Login failed.");
      setLoading(false);
      return;
    }

    createMockSession(data.user, data.token);
    router.replace(params.get("next") ?? "/dashboard");
  }

  return (
    <form className="mt-8 grid gap-5">
      <label className="grid gap-2 text-sm font-semibold text-slate-200 light:text-slate-800">
        Email or Username
        <input className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-emeraldx light:border-slate-200 light:bg-white light:text-slate-950" onChange={(event) => setEmail(event.target.value)} placeholder="you@vollifx.com" type="text" value={email} />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-slate-200 light:text-slate-800">
        Password
        <input className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-emeraldx light:border-slate-200 light:bg-white light:text-slate-950" onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" type="password" value={password} />
      </label>
      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 text-slate-300 light:text-slate-700">
          <input className="h-4 w-4 accent-emeraldx" type="checkbox" />
          Remember for 30 days
        </label>
        <ForgotPasswordAction email={email} />
      </div>
      {error ? <p className="rounded-lg bg-rose-500/10 p-3 text-sm font-bold text-rose-300">{error}</p> : null}
      <button className="inline-flex items-center justify-center gap-2 rounded-full bg-emeraldx px-6 py-4 text-sm font-black text-ink shadow-glow transition hover:-translate-y-1 hover:bg-white" disabled={loading} onClick={login} type="button">
        <LockKeyhole size={18} /> {loading ? "Signing In..." : "Sign In"}
      </button>
      <p className="text-center text-sm text-slate-400 light:text-slate-600">
        New to VOLLIFX?{" "}
        <Link className="font-bold text-emeraldx" href="/register">
          Create an account
        </Link>
      </p>
    </form>
  );
}
