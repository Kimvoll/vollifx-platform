"use client";

import { useState } from "react";
import { authHeaders } from "@/lib/auth";

export function SaveProfileButton() {
  const [message, setMessage] = useState("");

  return (
    <button
      className="mt-5 rounded-full bg-emeraldx px-6 py-3 text-sm font-black text-ink shadow-glow transition hover:bg-white"
      onClick={async () => {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ updatedAt: new Date().toISOString() })
        });
        const data = await response.json();
        setMessage(data.message);
      }}
      type="button"
    >
      {message || "Save Profile"}
    </button>
  );
}
