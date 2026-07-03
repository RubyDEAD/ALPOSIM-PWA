// ActionMenu.tsx
import { MoreHorizontal, RefreshCw, ClipboardCheck, History, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import ReorderStockDialog from '@/src/app/components/inventory/ReOrderStockDialog';
import { Product } from "@/src/types/types";

interface ActionMenuProps {
  product: Product; // Full product type
  onDelete: (id: string) => void;
  onReorder: (quantity: number) => Promise<void>; // Quantity only, product is already known
}

export default function ActionMenu({ product, onDelete, onReorder }: ActionMenuProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReorder = async (quantity: number) => {
    setIsLoading(true);
    try {
      await onReorder(quantity);
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to reorder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare product data for the form
  const formProduct = {
    id: product.id,
    name: product.name,
    productCode: product.productCode,
    quantity: product.quantity,
    minQuantity: product.minQuantity,
    metric: product.metric,
    status: product.status,
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">Actions for {product.name}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 rounded-xl">
          <DropdownMenuItem 
            className="text-[12px] gap-2 cursor-pointer"
            onClick={() => setDialogOpen(true)}
          >
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            Reorder stock
          </DropdownMenuItem>

          <DropdownMenuItem className="text-[12px] gap-2 cursor-pointer" asChild>
            <Link href={`/inventory/${product.id}/edit`}>
              <ClipboardCheck className="w-3.5 h-3.5 text-muted-foreground" />
              Audit stock
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="text-[12px] gap-2 cursor-pointer" asChild>
            <Link href={`/product/history/${product.id}`}>
              <History className="w-3.5 h-3.5 text-muted-foreground" />
              Product history
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-[12px] gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
            onClick={() => onDelete(product.id)}
          >
            <Package className="w-3.5 h-3.5 text-red-400" />
            Remove product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReorderStockDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={formProduct}
        loading={isLoading}
        onSubmit={handleReorder}
      />
    </>
  );
}