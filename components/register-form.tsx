"use client";

import Link from "next/link";
import { CheckCircle2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createMockSession } from "@/lib/auth";

const badges = ["Bank-Grade Security", "ASIC Regulated"];

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", terms: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function register() {
    setError("");
    if (!form.terms) {
      setError("Accept the terms before creating an account.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Account could not be created.");
      }
      createMockSession(data.user, data.token);
      router.replace("/dashboard");
    } catch (event) {
      setError(event instanceof Error ? event.message : "Account could not be created.");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span className="inline-flex items-center gap-2 rounded-full border border-emeraldx/25 bg-emeraldx/10 px-3 py-1.5 text-xs font-bold text-emeraldx" key={badge}>
            <CheckCircle2 size={14} /> {badge}
          </span>
        ))}
      </div>
      <form className="mt-8 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First name" onChange={(value) => update("firstName", value)} value={form.firstName} />
          <Field label="Last name" onChange={(value) => update("lastName", value)} value={form.lastName} />
        </div>
        <Field label="Email" onChange={(value) => update("email", value)} type="email" value={form.email} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Password" onChange={(value) => update("password", value)} type="password" value={form.password} />
          <Field label="Confirm Password" onChange={(value) => update("confirmPassword", value)} type="password" value={form.confirmPassword} />
        </div>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-300 light:text-slate-700">
          <input className="mt-1 h-4 w-4 accent-emeraldx" checked={form.terms} onChange={(event) => update("terms", event.target.checked)} type="checkbox" />
          I agree to the terms, risk disclosure, and account verification requirements.
        </label>
        {error ? <p className="rounded-lg bg-rose-500/10 p-3 text-sm font-bold text-rose-300">{error}</p> : null}
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-emeraldx px-6 py-4 text-sm font-black text-ink shadow-glow transition hover:-translate-y-1 hover:bg-white" disabled={loading} onClick={register} type="button">
          <UserPlus size={18} /> {loading ? "Creating..." : "Create Account"}
        </button>
        <p className="text-center text-sm text-slate-400 light:text-slate-600">
          Already registered?{" "}
          <Link className="font-bold text-emeraldx" href="/login">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-200 light:text-slate-800">
      {label}
      <input className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition focus:border-emeraldx light:border-slate-200 light:bg-white light:text-slate-950" onChange={(event) => onChange(event.target.value)} placeholder={label} type={type} value={value} />
    </label>
  );
}
