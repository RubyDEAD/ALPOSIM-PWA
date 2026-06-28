import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  description?: string;
}

export function StatCard({ title, value, icon, trend, className, description }: StatCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl border border-border shadow-sm px-5 py-4 space-y-3 hover:shadow-md transition-shadow',
      className
    )}>

      {/* Title row */}
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-muted-foreground">{title}</p>
        {icon && (
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <p className="text-[22px] font-semibold text-foreground leading-none tracking-tight">
        {value}
      </p>

      {/* Description + trend */}
      <div className="flex items-center justify-between gap-2">
        {description && (
          <p className="text-[11px] text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md ml-auto shrink-0',
            trend.isPositive
              ? 'bg-green-50 text-green-600'
              : 'bg-red-50 text-red-500'
          )}>
            {trend.isPositive
              ? <TrendingUp className="w-3 h-3" />
              : <TrendingDown className="w-3 h-3" />
            }
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>

    </div>
  );
}