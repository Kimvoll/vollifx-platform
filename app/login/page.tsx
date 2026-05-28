import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      sideText="Secure Access protects account entry with backend-ready fields, remembered sessions, and room for two-factor authentication."
      sideTitle="Secure Access"
      subtitle="Access your trading dashboard, allocation status, performance reports, and account controls."
      title="Welcome back"
    >
      <Suspense fallback={<div className="mt-8 h-72 rounded-lg bg-white/10" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
