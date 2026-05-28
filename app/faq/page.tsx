import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/lib/data";

export default function FAQPage() {
  return (
    <div className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <SectionHeading centered eyebrow="Support" title="Frequently Asked Questions" text="Clear answers for onboarding, funding, trading pools, security, withdrawals, and platform fees." />

        <div className="mt-12 space-y-4">
          {faqs.map(([question, answer]) => (
            <details className="glass group rounded-lg p-6 open:border-emeraldx/35" key={question}>
              <summary className="cursor-pointer list-none text-lg font-black text-white light:text-slate-950">
                {question}
              </summary>
              <p className="mt-4 text-sm leading-7 text-slate-400 light:text-slate-600">{answer}</p>
            </details>
          ))}
        </div>

        <div className="glass mt-12 rounded-lg p-8 text-center">
          <MessageCircleQuestion className="mx-auto text-emeraldx" size={34} />
          <h2 className="mt-4 text-2xl font-black text-white light:text-slate-950">Contact Support</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 light:text-slate-600">
            Need help with account setup, pool rules, compliance, or withdrawals? Contact support for account assistance and operational guidance.
          </p>
          <Link className="mt-6 inline-flex rounded-full bg-emeraldx px-6 py-3 text-sm font-black text-ink shadow-glow transition hover:-translate-y-1 hover:bg-white" href="/register">
            Open Account
          </Link>
        </div>
      </section>
    </div>
  );
}
