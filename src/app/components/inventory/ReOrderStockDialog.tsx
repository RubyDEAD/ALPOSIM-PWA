// components/ReorderStockDialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ReOrderStockForm from "./ReOrder";
import { Product } from "@/src/types/types";

interface ReorderStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    productCode: string;
    quantity: number;
    minQuantity: number;
    metric: string;
  };
  loading?: boolean;
  onSubmit: (quantity: number) => Promise<void>;
}

export default function ReorderStockDialog({
  open,
  onOpenChange,
  product,
  loading = false,
  onSubmit,
}: ReorderStockDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Reorder Stock</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add more stock to {product.name}
          </DialogDescription>
        </DialogHeader>
        <ReOrderStockForm
          product={product}
          loading={loading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}