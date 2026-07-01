import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Sale } from "@/src/types/types";
import { OrderRow } from "./OrderRow";
import { ShoppingCart, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type SortField = "saleCode" | "date" | "total";
type SortDir = "asc" | "desc";

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
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...orders].sort((a, b) => {
    if (!sortField) return 0;
    let aVal: string | number;
    let bVal: string | number;
    switch (sortField) {
      case "saleCode": aVal = a.saleCode.toLowerCase(); bVal = b.saleCode.toLowerCase(); break;
      case "date":     aVal = new Date(a.createdAt).getTime(); bVal = new Date(b.createdAt).getTime(); break;
      case "total":    aVal = a.totalPrice; bVal = b.totalPrice; break;
      default: return 0;
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 text-[11px] font-medium text-muted-foreground hover:text-foreground gap-1"
    >
      {label}
      <ArrowUpDown className={`w-2.5 h-2.5 transition-opacity ${sortField === field ? "opacity-100" : "opacity-40"}`} />
    </Button>
  );

  const firstCol = "pl-5 pr-4";
  const midCol   = "px-4";
  const lastCol  = "pl-4 pr-5";

  if (loading) {
    return (
      <div className="px-2 w-full space-y-3 ">
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 px-4">
              <TableHead className={`${firstCol} py-2.5`}><div className="h-3 w-16 bg-muted rounded-full animate-pulse" /></TableHead>
              <TableHead className={`${midCol} py-2.5`}><div className="h-3 w-16 bg-muted rounded-full animate-pulse" /></TableHead>
              <TableHead className={`${midCol} py-2.5`}><div className="h-3 w-10 bg-muted rounded-full animate-pulse mx-auto" /></TableHead>
              <TableHead className={`${midCol} py-2.5`}><div className="h-3 w-16 bg-muted rounded-full animate-pulse ml-auto" /></TableHead>
              <TableHead className={`${midCol} py-2.5`}><div className="h-3 w-14 bg-muted rounded-full animate-pulse" /></TableHead>
              <TableHead className={`${lastCol} py-2.5`} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell className={`${firstCol} py-3`}><div className="h-3 w-24 bg-muted rounded-full animate-pulse" /></TableCell>
                <TableCell className={`${midCol} py-3`}><div className="h-3 w-28 bg-muted rounded-full animate-pulse" /></TableCell>
                <TableCell className={`${midCol} py-3 text-center`}><div className="h-3 w-6 bg-muted rounded-full animate-pulse mx-auto" /></TableCell>
                <TableCell className={`${midCol} py-3`}><div className="h-3 w-16 bg-muted rounded-full animate-pulse ml-auto" /></TableCell>
                <TableCell className={`${midCol} py-3`}><div className="h-5 w-14 bg-muted rounded-md animate-pulse" /></TableCell>
                <TableCell className={`${lastCol} py-3`}><div className="h-7 w-7 bg-muted rounded-md animate-pulse ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-border bg-white">
        <ShoppingCart className="w-10 h-10 mb-3 opacity-10" />
        <p className="text-[13px] font-medium text-foreground">No orders found</p>
        <p className="text-[12px] text-muted-foreground mt-0.5">Orders will appear here once created</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className={`${firstCol} py-2.5 w-[22%]`}>
              <SortButton field="saleCode" label="Sale code" />
            </TableHead>
            <TableHead className={`${midCol} py-2.5 w-[20%]`}>
              <SortButton field="date" label="Date" />
            </TableHead>
            <TableHead className={`${midCol} py-2.5 w-[10%] text-[11px] font-medium text-muted-foreground text-center`}>
              Items
            </TableHead>
            <TableHead className={`${midCol} py-2.5 w-[15%] text-right`}>
              <SortButton field="total" label="Total" />
            </TableHead>
            <TableHead className={`${midCol} py-2.5 w-[15%] text-[11px] font-medium text-muted-foreground`}>
              Payment
            </TableHead>
            <TableHead className={`${lastCol} py-2.5 w-[8%]`} />
          </TableRow>
        </TableHeader>

        <TableBody>
          {sorted.map((sale) => (
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