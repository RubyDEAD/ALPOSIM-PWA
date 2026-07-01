// hooks/useProduct.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FetchProducts,
  FetchProductbyId,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  FetchProductbyName,
  FetchProductbyStatus,
  FetchProductbyCategory,
  FetchProductPaginated,
} from '@/src/api/product'; // Adjust import path
import { ProductInput } from '@/src/schema/schema';
import { Product } from '@/src/types/types';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: any) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: async () => {
      const response = await FetchProducts();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await FetchProductbyId(id);
      return response.data;
    },
    enabled: !!id, // Only run if id exists
    staleTime: 5 * 60 * 1000,
  });
};

// Get products by name
export const useProductsByName = (name: string) => {
  return useQuery({
    queryKey: [...productKeys.all, 'name', name],
    queryFn: async () => {
      const response = await FetchProductbyName(name);
      return response.data;
    },
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
};

// Get products by status
export const useProductsByStatus = (status: string) => {
  return useQuery({
    queryKey: [...productKeys.all, 'status', status],
    queryFn: async () => {
      const response = await FetchProductbyStatus(status);
      return response.data;
    },
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
  });
};

// Get products by category
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: [...productKeys.all, 'category', category],
    queryFn: async () => {
      const response = await FetchProductbyCategory(category);
      return response.data;
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};

// Get paginated products
export const useProductsPaginated = (
  page: number,
  limit: number,
  status = 'All',
  category = 'All',
  search = ''
) => {
  return useQuery({
    queryKey: [...productKeys.lists(), { page, limit, status, category, search }],
    queryFn: async () => {
      const response = await FetchProductPaginated(page, limit, status, category, search);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProductInput) => CreateProduct(data),
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data, changedBy }: { id: string; data: ProductInput; changedBy: string }) =>
      UpdateProduct(id, data, changedBy),
    onSuccess: (_, variables) => {
      // Invalidate specific product and all products list
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};