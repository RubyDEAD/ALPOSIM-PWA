'use client';

import { DashboardHeader } from '@/src/app/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/src/app/components/dashboard/DashboardStats';
import { DashboardAnalytics } from '@/src/app/components/dashboard/DashboardAnalytics';
import { DashboardActivity } from '@/src/app/components/dashboard/DashboardActivity';
import { DashboardSkeleton } from '@/src/app/components/dashboard/DashboardSkeleton';
import { useDashboardData } from '@/src/app/hooks/useDashboardData';

export default function DashboardPageClient() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            Failed to load dashboard
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">

        <DashboardHeader />

        <DashboardStats
          stats={data.stats}
        />

        <DashboardAnalytics
          dailyReports={data.dailyReports}
          categories={data.categories}
          productCounts={data.productCounts}
        />

        <DashboardActivity
          sales={data.sales}
          products={data.products}
          topProducts={data.topProducts}
          history={data.history}
          syncStatus={data.syncStatus}
          totalRevenue={data.stats.totalRevenue}
          totalSales={data.stats.totalSales}
        />

      </div>
    </main>
  );
}