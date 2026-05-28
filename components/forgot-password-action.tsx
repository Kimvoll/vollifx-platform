"use client";

import { useState } from "react";

export function ForgotPasswordAction({ email }: { email: string }) {
  const [message, setMessage] = useState("");

  return (
    <div className="grid gap-2 text-right">
      <button
        className="font-semibold text-emeraldx"
        onClick={async () => {
          const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });
          const data = await response.json();
          setMessage(data.message);
        }}
        type="button"
      >
        Forgot password
      </button>
      {message ? <p className="text-xs text-slate-400">{message}</p> : null}
    </div>
  );
}
