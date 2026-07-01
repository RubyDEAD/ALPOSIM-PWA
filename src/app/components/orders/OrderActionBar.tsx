'use client'

import { Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onAddOrder: () => void;
  totalOrders: number;
}

export default function OrderActionBar({ onAddOrder, totalOrders }: Props) {
  return (
    <div className="flex items-center justify-between p-10">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
          <ShoppingCart className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <h1 className="text-[15px] font-semibold text-foreground">Orders</h1>
          <p className="text-[12px] text-muted-foreground">
            {totalOrders} order{totalOrders !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Button
        onClick={onAddOrder}
        size="sm"
        className="gap-1.5 text-[13px] bg-amber-500 hover:bg-amber-600 text-white rounded-lg h-8"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Order
      </Button>
    </div>
  );
}