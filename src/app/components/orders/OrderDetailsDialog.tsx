import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

import { Sale } from "@/src/types/types";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  sale,
}: OrderDetailsDialogProps) {
  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Sale Code</p>
              <p className="font-medium">{sale.saleCode}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">
                {format(
                  new Date(sale.createdAt),
                  "MMMM dd, yyyy hh:mm a"
                )}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Payment</p>
              <OrderStatusBadge
                onlinePayment={sale.onlinePayment}
              />
            </div>

            <div>
              <p className="text-muted-foreground">Items</p>
              <p className="font-medium">{sale.items.length}</p>
            </div>
          </div>

          <Separator />

          {/* Purchased Items */}
          <div>
            <h3 className="mb-3 font-semibold">
              Purchased Items
            </h3>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">
                    Qty
                  </TableHead>
                  <TableHead className="text-right">
                    Unit Price
                  </TableHead>
                  <TableHead className="text-right">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sale.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.product?.name ?? "Unknown Product"}
                    </TableCell>

                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>

                    <TableCell className="text-right">
                      ₱
                      {item.unitPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>

                    <TableCell className="text-right">
                      ₱
                      {item.totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Summary */}
          <div className="ml-auto max-w-sm space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-medium">
                ₱
                {sale.totalPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Received Cash</span>
              <span>
                ₱
                {sale.receivedCash.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Change</span>
              <span>
                ₱
                {sale.change.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}