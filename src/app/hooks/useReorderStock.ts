// hooks/useReorderStock.ts
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { UpdateProduct } from '@/src/api/product';
import { Product } from '@/src/types/types';

export function useReorderStock() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const reorderStock = async (product: Product, quantity: number, changedBy: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate new quantity
      const newQuantity = product.quantity + quantity;
      
      // Match the Swagger contract for product updates.
      const updateData = {
        productCode: product.productCode,
        name: product.name,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        quantity: newQuantity,
        minQuantity: product.minQuantity,
        originalPrice: product.originalPrice,
        sellingPrice: product.sellingPrice,
        metric: product.metric,
      };
   

      const response = await UpdateProduct(product.id, updateData, changedBy);
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['product', product.id] });
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reorder stock'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reorderStock,
    isLoading,
    error,
  };
}