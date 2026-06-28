'use client';

import { 
  StatCard, 
  QuickActions, 
  RecentSales, 
  InventoryStatus,
  RevenueChart,
  TopProducts,
  ProductHistory,
  SyncStatus,
  CategoryBreakdown,
} from '@/src/app/components/dashboard';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Tags,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardData } from '@/src/app/hooks/useDashboardData';
import { CardContainer } from '@/src/app/components/dashboard/CardContainer';

export default function DashboardPageClient() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-1">
          <p className="text-[13px] font-medium text-foreground">Failed to load dashboard</p>
          <p className="text-[12px] text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const avgOrderValue = stats && stats.totalSales > 0
    ? (stats.totalRevenue / stats.totalSales).toFixed(2)
    : '0.00';

  const itemsSold = data?.sales.reduce(
    (acc, sale) => acc + sale.items.length, 0
  ) ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-semibold text-foreground">Dashboard</h1>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <RefreshCw className="w-3.5 h-3.5" />
            Live
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`₱${(stats?.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<DollarSign className="h-3.5 w-3.5" />}
            trend={{ value: stats?.revenueTrend ?? 0, isPositive: (stats?.revenueTrend ?? 0) > 0 }}
            description="Total sales revenue"
          />
          <StatCard
            title="Total Sales"
            value={stats?.totalSales ?? 0}
            icon={<ShoppingCart className="h-3.5 w-3.5" />}
            description="All time"
          />
          <StatCard
            title="Products"
            value={stats?.totalProducts ?? 0}
            icon={<Package className="h-3.5 w-3.5" />}
            description="In inventory"
          />
          <StatCard
            title="Categories"
            value={stats?.totalCategories ?? 0}
            icon={<Tags className="h-3.5 w-3.5" />}
            description="Product categories"
          />
        </div>

        {/* ── Charts row ── */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-4">
            <RevenueChart data={data?.dailyReports ?? []} />
          </div>
         
            <CategoryBreakdown
              categories={data?.categories ?? []}
              productCounts={data?.productCounts ?? {}}
            />
          
        </div>

     

        {/* ── Main content grid ── */}
        <div className="grid gap-3 grid-cols-3 lg:grid-cols-4">
          <CardContainer 
            title='Recent Sales' 
            description='Daily Sales' 
            icon={<ShoppingCart className="w-4 h-4" />}
          >
            <RecentSales sales={data?.sales ?? []} />
          </CardContainer>

          <InventoryStatus products={data?.products ?? []} />
          <TopProducts products={data?.topProducts ?? []} />
        </div>

        {/* ── Bottom row ── */}
        <div className="grid gap-3 grid-cols-3 xl:grid-cols-3">
          <ProductHistory history={data?.history ?? []} />

          <div className="space-y-3">
            <SyncStatus syncStatus={data?.syncStatus} />

            <CardContainer title="Quick Stats" description="Summary metrics">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 border border-border rounded-xl p-3">
                  <p className="text-[11px] text-muted-foreground">Avg Order Value</p>
                  <p className="text-[18px] font-semibold text-foreground mt-0.5">
                    ₱{avgOrderValue}
                  </p>
                </div>
                <div className="bg-gray-50 border border-border rounded-xl p-3">
                  <p className="text-[11px] text-muted-foreground">Items Sold</p>
                  <p className="text-[18px] font-semibold text-foreground mt-0.5">
                    {itemsSold}
                  </p>
                </div>
              </div>
            </CardContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>

        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-7">
          <Skeleton className="lg:col-span-4 h-64 rounded-2xl" />
          <Skeleton className="lg:col-span-3 h-64 rounded-2xl" />
        </div>

        <Skeleton className="h-28 rounded-2xl" />

        <div className="grid gap-3 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        </div>

      </div>
    </div>
  );
}