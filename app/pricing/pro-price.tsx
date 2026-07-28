"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui";

export function ProPrice({ monthlyUsd, weeklyUsd }: { monthlyUsd: number; weeklyUsd: number }) {
  const [cadence, setCadence] = useState<"monthly" | "weekly">("monthly");
  const amount = (cadence === "monthly" ? monthlyUsd : weeklyUsd).toFixed(2);
  const per = cadence === "monthly" ? "/mo" : "/wk";

  return (
    <>
      <Segmented
        value={cadence}
        onChange={(v) => setCadence(v as "monthly" | "weekly")}
        size="sm"
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "weekly", label: "Weekly" },
        ]}
      />
      <div className="pp-plan-price" style={{ marginTop: 12 }}>
        <span className="pp-plan-cur">$</span>
        {amount}
        <span className="pp-plan-per">{per}</span>
      </div>
    </>
  );
}
