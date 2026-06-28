// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

// Product
export interface Product {
  id: string;
  productCode: string;
  name: string;
  categoryId: number;
  category?: Category;
  imageUrl: string;
  quantity: number;
  minQuantity: number;
  status: string;
  originalPrice: number;
  sellingPrice: number;
  metric: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  categoryId: number;
  imageUrl: string;
  quantity: number;
  minQuantity: number;
  originalPrice: number;
  sellingPrice: number;
  metric: string;
}

// Category
export interface Category {
  id: number;
  name: string;
}

// Sale
export interface Sale {
  id: string;
  saleCode: string;
  items: SaleItem[];
  totalPrice: number;
  receivedCash: number;
  change: number;
  onlinePayment: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  quantity: number;
  costPrice: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SaleRequest {
  items: SaleItemRequest[];
  receivedCash: number;
  onlinePayment: boolean;
}

export interface SaleItemRequest {
  productId: string;
  quantity: number;
}

// Sync
export interface Sync {
  syncId: string;
  status: string;
  syncDate: string;
}

export interface SyncStatusDto {
  syncId: string;
  status: string;
  syncDate: string;
}

// Report
export interface DailyReport {
  date: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface Pagination<T> {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface ProductHistory {
  id: string;
  productId: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  action: string;
  changedBy: string;
  changedAt: string;
}