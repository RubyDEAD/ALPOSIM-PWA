export const STATUS_COLORS: Record<string, string> = {
  Critical: "bg-red-500/10 text-red-400 border border-red-500/20",
  Low: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  Normal: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  High: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};

export const STATUS_OPTIONS = ["All", "Critical", "Low", "Normal", "High"] as const;