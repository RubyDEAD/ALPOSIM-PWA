import api from "@/src/lib/api";
import { SaleInput } from "@/src/schema/schema";
import { SaleItemInput } from "@/src/schema/schema";

// Get all sales
export const FetchSales = () =>
  api.get("/api/sale");

// Get sale by ID
export const FetchSaleById = (id: string) =>
  api.get(`/api/sale/${id}`);

// Get sales by date range
export const FetchSalesByDateRange = (startDate: string, endDate: string) =>
  api.get(`/api/sale/range?startDate=${startDate}&endDate=${endDate}`);

// Get sales by payment status
export const FetchSalesByPaymentStatus = (payment: boolean) =>
  api.get(`/api/sale/payment?payment=${payment}`);

// Create sale
export const CreateSale = (data: SaleInput) =>
  api.post("/api/sale", data);

// Update sale
export const UpdateSale = (id: string, data: SaleInput) =>
  api.put(`/api/sale/${id}`, data);

// Delete sale
export const DeleteSale = (id: string) =>
  api.delete(`/api/sale/${id}`);

// Add item to a sale
export const AddSaleItem = (saleId: string, data: SaleItemInput) =>
  api.post(`/api/sale/${saleId}/items`, data);

// Remove item from a sale
export const RemoveSaleItem = (saleId: string, itemId: string) =>
  api.delete(`/api/sale/${saleId}/items/${itemId}`);

export const UpdateSaleItem = (saleId: string, data: SaleItemInput) =>
  api.patch(`/api/sale/${saleId}/items/${data}`);