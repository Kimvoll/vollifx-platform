"use client";

import { useState } from "react";
import { authHeaders } from "@/lib/auth";

export function KycUploadButton({ document }: { document: string }) {
  const [status, setStatus] = useState("");

  return (
    <div>
      <button
        className="mt-5 rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold transition hover:border-emeraldx hover:text-emeraldx light:border-slate-200"
        onClick={async () => {
          const response = await fetch("/api/kyc", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ document })
          });
          const data = await response.json();
          setStatus(data.status);
        }}
        type="button"
      >
        {status || "Upload"}
      </button>
    </div>
  );
}
