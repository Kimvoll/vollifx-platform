import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      sideText="Create your account, complete verification, fund securely, and access managed allocation workflows."
      sideTitle="Trust Infrastructure"
      subtitle="Start your onboarding into professional capital allocation and performance tracking."
      title="Join the Elite Trading Ecosystem"
    >
      <RegisterForm />
    </AuthShell>
  );
}
