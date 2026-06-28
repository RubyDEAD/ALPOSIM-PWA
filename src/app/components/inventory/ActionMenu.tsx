import { MoreHorizontal, RefreshCw, ClipboardCheck, BellRing, History, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionMenuProps {
  productId: string;
  productName: string;
  onDelete: (id: string) => void;
}

export default function ActionMenu({ productId, productName, onDelete }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Actions for {productName}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 rounded-xl">
        <DropdownMenuItem className="text-[12px] gap-2 cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          Reorder stock
        </DropdownMenuItem>

        <DropdownMenuItem className="text-[12px] gap-2 cursor-pointer" asChild>
          <Link href={`/inventory/${productId}/edit`}>
            <ClipboardCheck className="w-3.5 h-3.5 text-muted-foreground" />
            Audit stock
          </Link>
        </DropdownMenuItem>

        
        <DropdownMenuItem className="text-[12px] gap-2 cursor-pointer">
          <History className="w-3.5 h-3.5 text-muted-foreground" />
          <Link href={`product/history/${productId}`}>
          Product history
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-[12px] gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
          onClick={() => onDelete(productId)}
        >
          <Package className="w-3.5 h-3.5 text-red-400" />
          Remove product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}