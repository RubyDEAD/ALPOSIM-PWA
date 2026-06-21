import { useState, useMemo } from "react";
import { Product, Category } from "@/src/types/types";
import { Table, TableBody } from "@/components/ui/table";

import ProductTableHeader, { SortField, SortDir } from "./ProductTableHeader";
import ProductRow from "./ProductRow";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ProductTable({
  products,
  categories,
  onDelete,
  isLoading = false,
}: ProductTableProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [stockLevel, setStockLevel] = useState("All");
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

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Filter by stock level
    if (stockLevel === "Low") {
      result = result.filter((p) => p.quantity <= p.minQuantity);
    } else if (stockLevel === "Good") {
      result = result.filter((p) => p.quantity > p.minQuantity);
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;

        switch (sortField) {
          case "name":
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case "sku":
            aVal = a.productCode.toLowerCase();
            bVal = b.productCode.toLowerCase();
            break;
          case "stock":
            aVal = a.quantity;
            bVal = b.quantity;
            break;
          case "price":
            aVal = a.sellingPrice;
            bVal = b.sellingPrice;
            break;
          default:
            return 0;
        }

        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, stockLevel, sortField, sortDir]);

  if (isLoading) {
    return <LoadingSkeleton rows={6} />;
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full space-y-3">



      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <Table>
          <ProductTableHeader
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
          />
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                  No products match this filter.
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  categories={categories}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}