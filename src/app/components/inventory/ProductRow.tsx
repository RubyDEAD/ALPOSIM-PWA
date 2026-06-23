import { Package } from "lucide-react";
import { Product, Category } from "@/src/types/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StockBar from "./StockBar";
import ActionMenu from "./ActionMenu";

interface ProductRowProps {
  product: Product;
  categories: Category[];
  onDelete: (id: string) => void;
}

export default function ProductRow({ product, categories, onDelete }: ProductRowProps) {
  const category = categories.find((c) => c.id === product.categoryId);

  return (
    <TableRow className="group">

      {/* Product name */}
      <TableCell className="py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md border border-border bg-muted/30 flex items-center justify-center shrink-0 group-hover:border-amber-200 group-hover:bg-amber-50 transition-colors">
            <Package className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-amber-500 transition-colors" />
          </div>
          <span className="text-[13px] font-medium text-foreground truncate max-w-[180px]">
            {product.name}
          </span>
        </div>
      </TableCell>

      {/* SKU */}
      <TableCell className="py-3 font-mono text-[11px] text-muted-foreground">
        {product.productCode}
      </TableCell>

      {/* Category */}
      <TableCell className="py-3">
        <Badge
          variant="secondary"
          className="text-[11px] font-normal rounded-md px-2 py-0.5 bg-muted/50 text-muted-foreground border-0"
        >
          {category?.name ?? "—"}
        </Badge>
      </TableCell>

      {/* Stock bar */}
      <TableCell className="py-3">
        <StockBar
          quantity={product.quantity}
          minQuantity={product.minQuantity}
          
        />
      </TableCell>
      <TableCell className="py-3 text-right">
        <div className="text-[13px] font-medium text-foreground">
         {product.metric}
        </div>
      </TableCell>

      {/* Price */}
      <TableCell className="py-3 text-right">
        <div className="text-[13px] font-medium text-foreground">
          ₱{product.sellingPrice.toLocaleString()}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="py-3 text-right">
        <ActionMenu
          productId={product.id}
          productName={product.name}
          onDelete={onDelete}
        />
      </TableCell>

    </TableRow>
  );
}