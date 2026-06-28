'use client'

import { ArrowRight, Edit, TrendingUp, TrendingDown } from "lucide-react";
import { ProductHistory } from "@/src/types/types";

interface Props {
  item: ProductHistory;
}

const ACTION_CONFIG: Record<string, { bg: string; border: string; text: string; dot: string; icon: React.ReactNode }> = {
  Updated:   { bg: "bg-blue-50",   border: "border-blue-100",   text: "text-blue-700",   dot: "bg-blue-400",   icon: <Edit className="w-3 h-3" /> },
  Restocked: { bg: "bg-green-50",  border: "border-green-100",  text: "text-green-700",  dot: "bg-green-400",  icon: <TrendingUp className="w-3 h-3" /> },
  Adjusted:  { bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-700", dot: "bg-orange-400", icon: <TrendingDown className="w-3 h-3" /> },
};

const FIELD_LABELS: Record<string, string> = {
  SellingPrice:  "Selling Price",
  OriginalPrice: "Cost Price",
  Quantity:      "Quantity",
  Name:          "Product Name",
  CategoryId:    "Category",
  MinQuantity:   "Min Quantity",
  Metric:        "Unit",
  ImageUrl:      "Image URL",
};

function formatValue(field: string, value: string) {
  if (field === "SellingPrice" || field === "OriginalPrice") {
    return `₱${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  }
  return value;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function HistoryCard({ item }: Props) {
  const config = ACTION_CONFIG[item.action] ?? ACTION_CONFIG["Updated"];
  const { date, time } = formatDate(item.changedAt);
  const fieldLabel = FIELD_LABELS[item.fieldChanged] ?? item.fieldChanged;

  return (
    <div className="bg-white rounded-xl border border-border p-4 hover:border-amber-200 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-4">

        {/* Left — action badge + field */}
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${config.bg} ${config.border}`}>
            <span className={config.text}>{config.icon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[11px] font-semibold uppercase tracking-wide ${config.text}`}>
                {item.action}
              </span>
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-[12px] font-medium text-foreground">{fieldLabel}</span>
            </div>

            {/* Value diff */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[12px] px-2 py-0.5 bg-red-50 border border-red-100 text-red-600 rounded-md line-through font-mono">
                {formatValue(item.fieldChanged, item.oldValue)}
              </span>
              <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-[12px] px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 rounded-md font-mono font-medium">
                {formatValue(item.fieldChanged, item.newValue)}
              </span>
            </div>

            {/* Changed by */}
            <p className="text-[11px] text-muted-foreground">
              by{" "}
              <span className="font-medium text-foreground">{item.changedBy || "Unknown"}</span>
            </p>
          </div>
        </div>

        {/* Right — date/time */}
        <div className="text-right flex-shrink-0">
          <p className="text-[12px] font-medium text-foreground">{date}</p>
          <p className="text-[11px] text-muted-foreground">{time}</p>
        </div>
      </div>
    </div>
  );
}