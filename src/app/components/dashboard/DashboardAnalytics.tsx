"use client";

import { BarChart3, PieChart } from "lucide-react";

import { DashboardCard } from "./DashboardCard";
import { RevenueChart } from "./RevenueChart";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { DailyReport } from "@/src/types/types"


interface Category {
  id: number;
  name: string;
}



interface DashboardAnalyticsProps {
  dailyReports: DailyReport[];
  categories: Category[];
  productCounts: Record<number, number>;
}

export function DashboardAnalytics({
  dailyReports,
  categories,
  productCounts,
}: DashboardAnalyticsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Analytics
        </h2>

        <p className="text-sm text-muted-foreground">
          Revenue trends and inventory distribution.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">

        {/* Revenue Chart */}
        <DashboardCard
          className="lg:col-span-7"
          title="Revenue Analytics"
          description="Daily revenue performance"
          icon={<BarChart3 className="h-5 w-5" />}
        >
          <RevenueChart data={dailyReports} />
        </DashboardCard>

        {/* Category Breakdown */}
        <DashboardCard
          className="lg:col-span-5"
          title="Category Breakdown"
          description="Products grouped by category"
          icon={<PieChart className="h-5 w-5" />}
        >
          <CategoryBreakdown
            categories={categories}
            productCounts={productCounts}
          />
        </DashboardCard>

      </div>
    </section>
  );
}