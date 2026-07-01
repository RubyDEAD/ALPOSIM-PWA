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
import { format } from "date-fns";
import { Sale } from "@/src/types/types";
import { Wifi, Banknote, Package, Receipt, CalendarDays, CreditCard, Hash } from "lucide-react";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
}

const fmt = (n: number) =>
  `₱${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function OrderDetailsDialog({ open, onOpenChange, sale }: OrderDetailsDialogProps) {
  if (!sale) return null;

  const change = sale.receivedCash - sale.totalPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden rounded-2xl">

        {/* Header */}
        <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" />
        <DialogHeader className="px-6 py-4 border-b border-border bg-gray-50/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-[14px] font-semibold text-foreground">
                Order Details
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {sale.saleCode}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-border/60 rounded-xl px-4 py-3 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                <CalendarDays className="w-3 h-3" /> Date
              </div>
              <p className="text-[13px] font-medium text-foreground">
                {format(new Date(sale.createdAt), "MMM dd, yyyy")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {format(new Date(sale.createdAt), "hh:mm a")}
              </p>
            </div>

            <div className="bg-gray-50 border border-border/60 rounded-xl px-4 py-3 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                <CreditCard className="w-3 h-3" /> Payment
              </div>
              <div className={`inline-flex items-center gap-1.5 text-[20px] font-medium px-2 py-1 rounded-md ${
                sale.onlinePayment
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-100 text-green-500"
              }`}>
                {sale.onlinePayment
                  ? <Wifi className="w-3 h-3" />
                  : <Banknote className="w-3 h-3" />
                }
                {sale.onlinePayment ? "Online" : "Cash"}
              </div>
            </div>

            <div className="bg-gray-50 border border-border/60 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                <Hash className="w-3 h-3" /> Items
              </div>
              <p className="text-[13px] font-medium text-foreground">
                {sale.items.length} item{sale.items.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="bg-gray-50 border border-border/60 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                <Receipt className="w-3 h-3" /> Total
              </div>
              <p className="text-[13px] font-semibold text-foreground">
                {fmt(sale.totalPrice)}
              </p>
            </div>
          </div>

          {/* Items table */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[12px] font-medium text-foreground">Purchased items</p>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="pl-4 pr-3 py-2.5 text-[11px] font-medium text-muted-foreground">Product</TableHead>
                    <TableHead className="px-3 py-2.5 text-[11px] font-medium text-muted-foreground text-center">Qty</TableHead>
                    <TableHead className="px-3 py-2.5 text-[11px] font-medium text-muted-foreground text-right">Unit price</TableHead>
                    <TableHead className="pl-3 pr-4 py-2.5 text-[11px] font-medium text-muted-foreground text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/60">
                      <TableCell className="pl-4 pr-3 py-2.5 text-[13px] font-medium text-foreground">
                        {item.name || "Unknown Product"}
                      </TableCell>
                      <TableCell className="px-3 py-2.5 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted/50 text-[11px] font-medium text-muted-foreground">
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2.5 text-[13px] text-right text-muted-foreground">
                        {fmt(item.unitPrice)}
                      </TableCell>
                      <TableCell className="pl-3 pr-4 py-2.5 text-[13px] font-semibold text-right text-foreground">
                        {fmt(item.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border border-border/60 rounded-xl px-4 py-3 space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted-foreground">Grand total</span>
              <span className="font-semibold text-foreground">{fmt(sale.totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted-foreground">Received cash</span>
              <span className="font-medium text-foreground">{fmt(sale.receivedCash)}</span>
            </div>
            <div className="h-px bg-border/60 my-1" />
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted-foreground">Change</span>
              <span className={`font-semibold ${change >= 0 ? "text-green-600" : "text-red-500"}`}>
                {fmt(change)}
              </span>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}