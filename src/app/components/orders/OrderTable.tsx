import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sale } from "@/src/types/types";
import { OrderRow } from "./OrderRow";

interface OrderTableProps {
  orders: Sale[];
  loading?: boolean;

  onView: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
}

export function OrderTable({
  orders,
  loading = false,
  onView,
  onDelete,
}: OrderTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sale Code</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="w-[120px] text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((sale) => (
            <OrderRow
              key={sale.id}
              sale={sale}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}