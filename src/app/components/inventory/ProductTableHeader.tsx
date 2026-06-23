import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type SortField = "name" | "sku" | "stock" | "price";
export type SortDir = "asc" | "desc";

interface ProductTableHeaderProps {
  sortField: SortField | null;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}

export default function ProductTableHeader({ sortField, sortDir, onSort }: ProductTableHeaderProps) {
  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(field)}
      className="h-auto p-0 text-[11px] font-medium text-muted-foreground hover:text-foreground gap-1"
    >
      {label}
      <ArrowUpDown
        className={`w-2.5 h-2.5 transition-opacity ${sortField === field ? "opacity-100" : "opacity-40"}`}
      />
    </Button>
  );

  return (
    <TableHeader>
      <TableRow className="bg-muted/40 hover:bg-muted/40">
        <TableHead className="w-[28%]">
          <SortButton field="name" label="Product name" />
        </TableHead>
        <TableHead className="w-[13%]">
          <SortButton field="sku" label="SKU" />
        </TableHead>
        <TableHead className="w-[12%] text-[11px] text-muted-foreground font-medium">
          Category
        </TableHead>
        <TableHead className="w-[15%]">
          <SortButton field="stock" label="Current stock" />
        </TableHead>
        <TableHead className="w-[16%] text-right text-[11px] text-muted-foreground font-medium">
          Metric
        </TableHead>
        <TableHead className="w-[11%] text-right">
          <SortButton field="price" label="Unit price" />
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}