import { z } from "zod";


export const LoginSchema = z.object({
    username: z.string().min(1, "Username is Required"),
    password: z.string().min(1, "Password is Required"),
});

export const RegisterSchema = z.object({
    username: z.string().min(3, "Username needs more than 3 or more characters"),
    password: z.string().min(6, "Password needs 6 or more characters"),
});

export const ProductSchema = z.object({
    name: z.string().min(1, "Invalid Product Name"),
    categoryId: z.number().min(1, "Category is required"),
    imageUrl: z.string(),
    quantity: z.number().min(0, "Product Quantity must be 0 or more"),
    minQuantity: z.number().min(0, "Product Minimum Quantity must be 0 or more"),
    originalPrice: z.number().min(0, "Product Price must be 0 or more"),
    sellingPrice: z.number().min(0, "Selling Price be 0 or more"),
    metric: z.string().min(1, "Metric is required"),
})

export const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

export const SaleItemSchema = z.object({
  productId: z.string().uuid("Invalid product"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const SaleSchema = z.object({
  items: z.array(SaleItemSchema).min(1, "At least one item is required"),
  receivedCash: z.number().min(0, "Received cash must be 0 or more"),
  onlinePayment: z.boolean(),
});


export const SyncDateRangeSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ProductInput = z.infer<typeof ProductSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
export type SaleInput = z.infer<typeof SaleSchema>;
export type SaleItemInput = z.infer<typeof SaleItemSchema>;
export type SyncDateRangeInput = z.infer<typeof SyncDateRangeSchema>;
