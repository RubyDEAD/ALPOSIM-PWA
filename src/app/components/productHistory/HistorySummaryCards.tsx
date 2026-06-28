'use client'

import { ProductHistory } from "@/src/types/types";

interface Props {
  history: ProductHistory[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function HistorySummaryCards({ history }: Props) {
  if (history.length === 0) return null;

  const stats = [
    { label: "Total changes", value: String(history.length) },
    { label: "Last changed by", value: history[0]?.changedBy || "—" },
    { label: "Last changed", value: formatDate(history[0]?.changedAt) },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-border p-4">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">
            {stat.label}
          </p>
          <p className="text-[15px] font-semibold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}