"use client";

import { useState } from "react";
import { authHeaders } from "@/lib/auth";

export function SaveSettingsButton({ title }: { title: string }) {
  const [message, setMessage] = useState("");

  return (
    <button
      className="mt-5 rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold transition hover:border-emeraldx hover:text-emeraldx light:border-slate-200"
      onClick={async () => {
        const response = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ section: title, updatedAt: new Date().toISOString() })
        });
        const data = await response.json();
        setMessage(data.message);
      }}
      type="button"
    >
      {message || "Save Settings"}
    </button>
  );
}
