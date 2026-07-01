"use client";

import {
  DollarSign,
  Package,
  ShoppingCart,
  Tags,
} from "lucide-react";

import { StatCard } from "./StatCard";

interface DashboardStatsProps {
  stats: {
    totalRevenue: number;
    revenueTrend: number;
    totalSales: number;
    totalProducts: number;
    totalCategories: number;
  };
}

export function DashboardStats({
  stats,
}: DashboardStatsProps) {
  const revenue = stats?.totalRevenue ?? 0;
  const sales = stats?.totalSales ?? 0;
  const products = stats?.totalProducts ?? 0;
  const categories = stats?.totalCategories ?? 0;
  const trend = stats?.revenueTrend ?? 0;

  return (
    <section className="space-y-4">

      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Overview
        </h2>

        <p className="text-sm text-muted-foreground">
          Your business performance at a glance.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Revenue"
          value={`₱${revenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          description="Total sales revenue"
          icon={
            <DollarSign className="h-5 w-5" />
          }
          trend={{
            value: trend,
            isPositive: trend >= 0,
          }}
        />

        <StatCard
          title="Sales"
          value={sales}
          description="Completed transactions"
          icon={
            <ShoppingCart className="h-5 w-5" />
          }
        />

        <StatCard
          title="Products"
          value={products}
          description="Items in inventory"
          icon={
            <Package className="h-5 w-5" />
          }
        />

        <StatCard
          title="Categories"
          value={categories}
          description="Available categories"
          icon={
            <Tags className="h-5 w-5" />
          }
        />

      </div>

    </section>
  );
}