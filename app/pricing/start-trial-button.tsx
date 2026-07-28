"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";

export function StartTrialButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setError(data?.error ?? "Couldn't start checkout — try again.");
    } catch {
      setError("Couldn't start checkout — try again.");
    }
    setPending(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <button type="button" onClick={start} disabled={pending} className="oa-btn oa-btn-accent oa-btn-md">
        {pending ? "Starting…" : "Start your free trial"} <Icon name="arrow-right" size={16} />
      </button>
      {error ? <span style={{ fontSize: 12.5, color: "var(--loss)" }}>{error}</span> : null}
    </div>
  );
}
