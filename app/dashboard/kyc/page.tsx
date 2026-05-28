import { UploadCloud } from "lucide-react";
import { KycUploadButton } from "@/components/dashboard/kyc-upload-button";

export default function KycPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-goldx">Verification</p>
        <h1 className="mt-2 text-3xl font-black">KYC Verification</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["Identity Document", "Proof of Address", "Source of Funds"].map((item) => (
          <div className="glass rounded-lg p-6" key={item}>
            <UploadCloud className="text-emeraldx" size={30} />
            <h2 className="mt-5 text-lg font-black">{item}</h2>
            <p className="mt-2 text-sm text-slate-400 light:text-slate-600">Submit the required verification document for compliance review.</p>
            <KycUploadButton document={item} />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-goldx/25 bg-goldx/10 p-5 text-sm text-goldx">Pending KYC status: profile is awaiting proof of address.</div>
    </div>
  );
}
