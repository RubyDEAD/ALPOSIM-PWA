import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Sale } from "@/src/types/types";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderRowProps {
  sale: Sale;
  onView: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
}

export function OrderRow({
  sale,
  onView,
  onDelete,
}: OrderRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {sale.saleCode}
      </TableCell>

      <TableCell>
        {format(new Date(sale.createdAt), "MMM dd, yyyy hh:mm a")}
      </TableCell>

      <TableCell className="text-center">
        {sale.items.length}
      </TableCell>

      <TableCell className="text-right font-medium">
        ₱
        {sale.totalPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </TableCell>

      <TableCell>
        <OrderStatusBadge
          onlinePayment={sale.onlinePayment}
        />
      </TableCell>

      <TableCell>
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onView(sale)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(sale)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}