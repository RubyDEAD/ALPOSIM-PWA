// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

// ── Category ──────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
}

export interface CategoryInput {
  name: string;
}

// ── Product ───────────────────────────────────────────────────────────────────

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

export interface ProductInput {
  name: string;
  categoryId: number;
  imageUrl?: string;
  quantity: number;
  minQuantity: number;
  originalPrice: number;
  sellingPrice: number;
  metric: string;
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

// ── Sale ──────────────────────────────────────────────────────────────────────

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  name: string;
  product?: Product;
  quantity: number;
  costPrice: number;
  unitPrice: number;
  totalPrice: number;
}

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

export interface SaleItemInput {
  productId: string;
  quantity: number;
}

export interface SaleInput {
  items: SaleItemInput[];
  receivedCash: number;
  onlinePayment: boolean;
}

// ── Report ────────────────────────────────────────────────────────────────────

export interface DailyReport {
  date: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
}

// ── Sync ──────────────────────────────────────────────────────────────────────

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


export interface UpdateSaleItemQuantityDto{
  quantity: number;
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface Pagination<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}