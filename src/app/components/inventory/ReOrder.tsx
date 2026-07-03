'use client';

import { useState } from "react";
import { Package, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Product } from "@/src/types/types";

interface ReOrderStockFormProps {
  product: {
    id: string;
    name: string;
    productCode: string;
    quantity: number;
    minQuantity: number;
    metric: string;
  };
  loading?: boolean;
  onSubmit: (quantity: number) => void | Promise<void>;
}

export default function ReOrderStockForm({ product, onSubmit, loading = false }: ReOrderStockFormProps) {
  const [quantity, setQuantity] = useState<number>(1);

  const newTotal = product.quantity + quantity;
  const isLow = product.quantity <= product.minQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    onSubmit(quantity);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Product info */}
      <div className="flex items-center gap-3 bg-gray-50 border border-border/60 rounded-xl px-4 py-3">
        <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <Package className="w-4 h-4 text-amber-500" />
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-foreground truncate">{product.name}</p>
          <p className="text-[11px] text-muted-foreground font-mono">{product.productCode}</p>
        </div>
      </div>

      {/* Current + min quantity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 border border-border/60 rounded-xl px-4 py-3">
          <p className="text-[11px] text-muted-foreground mb-0.5">Current stock</p>
          <p className={`text-[18px] font-semibold ${isLow ? "text-red-500" : "text-foreground"}`}>
            {product.quantity}
            <span className="text-[11px] font-normal text-muted-foreground ml-1">{product.metric}</span>
          </p>
          {isLow && (
            <p className="text-[10px] text-red-400 mt-0.5">Below minimum</p>
          )}
        </div>

        <div className="bg-gray-50 border border-border/60 rounded-xl px-4 py-3">
          <p className="text-[11px] text-muted-foreground mb-0.5">Minimum stock</p>
          <p className="text-[18px] font-semibold text-foreground">
            {product.minQuantity}
            <span className="text-[11px] font-normal text-muted-foreground ml-1">{product.metric}</span>
          </p>
        </div>
      </div>

      {/* Added quantity input */}
      <div className="space-y-1.5">
        <Label className="text-[13px]">Added quantity</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg shrink-0"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="w-3.5 h-3.5" />
          </Button>

          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            className="h-9 text-[13px] rounded-lg text-center font-medium"
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg shrink-0"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* New total preview */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-xl border text-[12px] ${
        newTotal >= product.minQuantity
          ? "bg-green-50 border-green-100 text-green-700"
          : "bg-amber-50 border-amber-100 text-amber-700"
      }`}>
        <span>New total stock</span>
        <span className="font-semibold text-[14px]">
          {newTotal} {product.metric}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <Button
          type="submit"
          size="sm"
          disabled={loading || quantity <= 0}
          className="h-9 px-5 rounded-lg text-[13px] bg-amber-500 hover:bg-amber-600 text-white"
        >
          {loading ? "Saving…" : "Reorder stock"}
        </Button>
      </div>

    </form>
  );
}