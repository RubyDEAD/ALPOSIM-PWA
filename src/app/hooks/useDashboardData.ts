import { useQueries } from '@tanstack/react-query';
import { FetchProducts } from '@/src/api/product';
import { FetchCategories } from '@/src/api/category';
import { FetchSales } from '@/src/api/sale';
import { FetchDailyReport, FetchMonthlyReport } from '@/src/api/report';
import { FetchProductHistories } from '@/src/api/productHistory';
import { FetchSyncs } from '@/src/api/sync';
import { Product, Sale, Category, DailyReport, SyncStatusDto, ProductHistory } from '@/src/types/types';

export function useDashboardData() {
  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const results = useQueries({
    queries: [
      {
        queryKey: ['products'],
        queryFn: async () => {
          const res = await FetchProducts();
          return res.data as Product[];
        },
        staleTime: 1000 * 60 * 2,
      },
      {
        queryKey: ['categories'],
        queryFn: async () => {
          const res = await FetchCategories();
          return res.data as Category[];
        },
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ['sales'],
        queryFn: async () => {
          const res = await FetchSales();
          return res.data as Sale[];
        },
        staleTime: 1000 * 60 * 1,
      },
      {
        queryKey: ['report', 'daily', today],
        queryFn: async () => {
          const res = await FetchDailyReport(today);
          return res.data;
        },
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ['report', 'monthly', currentYear],
        queryFn: async () => {
          const res = await FetchMonthlyReport(currentYear);
          return res.data;
        },
        staleTime: 1000 * 60 * 10,
      },
      {
        queryKey: ['syncs'],
        queryFn: async () => {
          const res = await FetchSyncs();
          return res.data as SyncStatusDto[];
        },
        staleTime: 1000 * 60 * 1,
      },
      {
        queryKey: ['productHistories'],
        queryFn: async () => {
          const res = await FetchProductHistories();
          return res.data as ProductHistory[];
        },
        staleTime: 1000 * 60 * 2,
      },
    ],
  });

  const [
    productsQ,
    categoriesQ,
    salesQ,
    dailyReportQ,
    monthlyReportsQ,
    syncsQ,
    historiesQ,
  ] = results;

  const isLoading = results.some((r) => r.isLoading);
  const error = results.find((r) => r.error)?.error as Error | null ?? null;

  const products: Product[]    = productsQ.data   ?? [];
  const categories: Category[] = categoriesQ.data ?? [];
  const sales: Sale[]          = salesQ.data      ?? [];
  const syncStatus: SyncStatusDto = syncsQ.data?.[0] ?? {
    syncId: '', status: 'Unknown', syncDate: new Date().toISOString(),
  };

  // Map ReportDto → DailyReport shape the chart expects
  const rawReports: any[] = monthlyReportsQ.data ?? [];
  const dailyReports: DailyReport[] = rawReports.map((r) => ({
    period:          r.period          ?? '',
    revenue:         r.revenue         ?? 0,
    cogs:            r.cogs            ?? 0,
    grossProfit:     r.grossProfit     ?? 0,
    periodStartDate: r.periodStartDate ?? '',
    periodEndDate:   r.periodEndDate   ?? '',
  }));

  // ── Derived stats ─────────────────────────────────────────────────────────

  const totalRevenue    = sales.reduce((acc, s) => acc + (s.totalPrice ?? 0), 0);
  const totalSales      = sales.length;
  const totalProducts   = products.length;
  const totalCategories = categories.length;

  const thisMonth = new Date().getMonth();
  const thisMonthRevenue = sales
    .filter((s) => new Date(s.createdAt).getMonth() === thisMonth)
    .reduce((acc, s) => acc + (s.totalPrice ?? 0), 0);
  const lastMonthRevenue = sales
    .filter((s) => new Date(s.createdAt).getMonth() === thisMonth - 1)
    .reduce((acc, s) => acc + (s.totalPrice ?? 0), 0);
  const revenueTrend = lastMonthRevenue > 0
    ? Number((((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1))
    : 0;

  const productCounts: Record<number, number> = products.reduce(
    (acc, p) => { acc[p.categoryId] = (acc[p.categoryId] ?? 0) + 1; return acc; },
    {} as Record<number, number>
  );

  const recentSales = [...sales]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const lowStockProducts = products
    .filter((p) => p.quantity <= p.minQuantity)
    .slice(0, 10);

  const topProducts = [...products]
    .sort((a, b) => b.sellingPrice - a.sellingPrice)
    .slice(0, 5);

  const recentHistory: ProductHistory[] = [...(historiesQ.data ?? [])]
    .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
    .slice(0, 10);

  return {
    data: {
      stats: { totalRevenue, totalSales, totalProducts, totalCategories, revenueTrend },
      sales: recentSales,
      products: lowStockProducts,
      topProducts,
      history: recentHistory,
      dailyReports,
      categories,
      productCounts,
      syncStatus,
    },
    isLoading,
    error,
    queries: {
      products:       productsQ,
      categories:     categoriesQ,
      sales:          salesQ,
      dailyReport:    dailyReportQ,
      monthlyReports: monthlyReportsQ,
      syncs:          syncsQ,
    },
  };
}