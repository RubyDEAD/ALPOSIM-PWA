import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Wifi, Banknote, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Sale } from "@/src/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderRowProps {
  sale: Sale;
  onView: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
}

export function OrderRow({ sale, onView, onDelete }: OrderRowProps) {
  return (
    <TableRow className="group hover:bg-gray-50/60 transition-colors">

      {/* Sale code */}
      <TableCell className="pl-5 pr-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md border border-border bg-muted/30 flex items-center justify-center shrink-0 group-hover:border-amber-200 group-hover:bg-amber-50 transition-colors">
            <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-amber-500 transition-colors">
              {sale.saleCode.slice(-2).toUpperCase()}
            </span>
          </div>
          <span className="text-[13px] font-medium text-foreground font-mono">
            {sale.saleCode}
          </span>
        </div>
      </TableCell>

      {/* Date */}
      <TableCell className="px-4 py-3">
        <div>
          <p className="text-[12px] text-foreground">
            {format(new Date(sale.createdAt), "MMM dd, yyyy")}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {format(new Date(sale.createdAt), "hh:mm a")}
          </p>
        </div>
      </TableCell>

      {/* Items */}
      <TableCell className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted/50 text-[11px] font-medium text-muted-foreground">
          {sale.items.length}
        </span>
      </TableCell>

      {/* Total */}
      <TableCell className="pl-4 pr-5 py-3 text-right">
        <span className="text-[13px] font-semibold text-foreground">
          ₱{sale.totalPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </TableCell>

      {/* Payment */}
      <TableCell className="px-4 py-3">
        <div className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md ${
          sale.onlinePayment
            ? "bg-blue-50 text-blue-600"
            : "bg-gray-100 text-gray-500"
        }`}>
          {sale.onlinePayment
            ? <Wifi className="w-3 h-3" />
            : <Banknote className="w-3 h-3" />
          }
          {sale.onlinePayment ? "Online" : "Cash"}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="pl-4 pr-5 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">Actions for {sale.saleCode}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-xl">
            <DropdownMenuItem
              className="text-[12px] gap-2 cursor-pointer"
              onClick={() => onView(sale)}
            >
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              View details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[12px] gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
              onClick={() => onDelete(sale)}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              Delete order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>

    </TableRow>
  );
}