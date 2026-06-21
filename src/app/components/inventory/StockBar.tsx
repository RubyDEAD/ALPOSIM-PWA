interface StockBarProps {
  quantity: number;
  minQuantity: number;
  metric?: string;
}

export default function StockBar({ quantity, minQuantity, metric = "unit" }: StockBarProps) {
  // Determine status and fill percentage
  const getStatus = () => {
    if (quantity <= 3) return { label: "Critical", color: "text-red-600", barColor: "bg-red-600", fillPercent: 10 };
    if (quantity <= minQuantity) return { label: "Low", color: "text-amber-500", barColor: "bg-amber-500", fillPercent: 25 };
    if (quantity <= minQuantity * 2) return { label: "Normal", color: "text-blue-500", barColor: "bg-blue-500", fillPercent: 60 };
    return { label: "High", color: "text-green-600", barColor: "bg-green-500", fillPercent: 100 };
  };

  const status = getStatus();

  return (
    <div className="min-w-[90px]">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12px] font-medium text-foreground">
          {quantity} {metric}
        </span>
        <span className={`text-[10px] font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>
      <div className="h-[3px] bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${status.barColor}`}
          style={{ width: `${status.fillPercent}%` }}
        />
      </div>
    </div>
  );
}