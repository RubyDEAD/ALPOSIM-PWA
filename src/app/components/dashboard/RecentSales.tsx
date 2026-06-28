import { format } from 'date-fns';
import { Sale } from '@/src/types/types';
import { ShoppingBag, Wifi, Banknote } from 'lucide-react';

interface RecentSalesProps {
  sales: Sale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ShoppingBag className="w-8 h-8 text-muted-foreground/20 mb-2" />
        <p className="text-[12px] text-muted-foreground">No sales yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/60">
      {sales.slice(0, 5).map((sale) => (
        <div key={sale.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">

          {/* Left — code + avatar */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-border flex items-center justify-center shrink-0">
              <span className="text-[11px] font-semibold text-muted-foreground">
                {sale.saleCode.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">{sale.saleCode}</p>
              <p className="text-[11px] text-muted-foreground">
                {format(new Date(sale.createdAt), 'MMM d · h:mm a')}
              </p>
            </div>
          </div>

          {/* Right — amount + payment type */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-[13px] font-semibold text-foreground">
              ₱{sale.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <div className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
              sale.onlinePayment
                ? 'bg-blue-50 text-blue-600'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {sale.onlinePayment
                ? <Wifi className="w-2.5 h-2.5" />
                : <Banknote className="w-2.5 h-2.5" />
              }
              {sale.onlinePayment ? 'Online' : 'Cash'}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}