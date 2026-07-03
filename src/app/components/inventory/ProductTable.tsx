// ProductTable.tsx
'use client';

import { Product, Category } from "@/src/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductRow from "./ProductRow";
import { useReorderStock } from '@/src/app/hooks/useReorderStock';
import { useAuth } from '@/src/app/hooks/useAuth';

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onDelete: (id: string) => void;
}

export default function ProductTable({ 
  products, 
  categories, 
  onDelete 
}: ProductTableProps) {
  const { reorderStock, isLoading } = useReorderStock();
  const { username } = useAuth();

  const handleReorder = async (product: Product, quantity: number) => {
    try {
      // Use the username from cookies, fallback to 'system'
      await reorderStock(product, quantity, username || 'system');
      // Optionally show success toast
    } catch (error) {
      console.error('Failed to reorder:', error);
      // Optionally show error toast
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Metric</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            categories={categories}
            onDelete={onDelete}
            onReorder={handleReorder}
          />
        ))}
      </TableBody>
    </Table>
  );
}