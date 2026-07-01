"use client";

import {
  History,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { DashboardCard } from "./DashboardCard";
import { RecentSales } from "./RecentSales";
import { InventoryStatus } from "./InventoryStatus";
import { TopProducts } from "./TopProducts";
import { ProductHistory } from "./ProductHistory";
import { SyncStatus } from "./SyncStatus";

interface DashboardActivityProps {
  sales: any[];
  products: any[];
  topProducts: any[];
  history: any[];
  syncStatus: any;

  totalRevenue: number;
  totalSales: number;
}

export function DashboardActivity({
  sales,
  products,
  topProducts,
  history,
  syncStatus,
  totalRevenue,
  totalSales,
}: DashboardActivityProps) {
  const avgOrder =
    totalSales > 0
      ? totalRevenue / totalSales
      : 0;

  const itemsSold =
    sales.reduce(
      (sum, sale) => sum + sale.items.length,
      0
    );

  return (
    <section className="space-y-4">

      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Business Activity
        </h2>

        <p className="text-sm text-muted-foreground">
          Monitor transactions, inventory, synchronization, and product updates.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">

        {/* Recent Sales */}

        <DashboardCard
          className="lg:col-span-7"
          title="Recent Sales"
          description="Latest completed transactions"
          icon={<ShoppingCart className="h-5 w-5" />}
        >
          <RecentSales sales={sales} />
        </DashboardCard>

        {/* Inventory */}

        <DashboardCard
          className="lg:col-span-5"
          title="Inventory Status"
          description="Current stock overview"
          icon={<Package className="h-5 w-5" />}
        >
          <InventoryStatus products={products} />
        </DashboardCard>

        {/* Top Products */}

        <DashboardCard
          className="lg:col-span-5"
          title="Top Products"
          description="Best performing items"
          icon={<TrendingUp className="h-5 w-5" />}
        >
          <TopProducts products={topProducts} />
        </DashboardCard>

        {/* History */}

        <DashboardCard
          className="lg:col-span-7"
          title="Product History"
          description="Recent inventory updates"
          icon={<History className="h-5 w-5" />}
        >
          <ProductHistory history={history} />
        </DashboardCard>

        {/* Sync */}

        <DashboardCard
          className="lg:col-span-6"
          title="Sync Status"
          description="Latest synchronization"
          icon={<RefreshCw className="h-5 w-5" />}
        >
          <SyncStatus syncStatus={syncStatus} />
        </DashboardCard>

        {/* Quick Stats */}

        <DashboardCard
          className="lg:col-span-6"
          title="Quick Stats"
          description="Summary metrics"
        >
          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl border bg-muted/30 p-5">
              <p className="text-xs text-muted-foreground">
                Average Order
              </p>

              <p className="mt-2 text-2xl font-bold">
                ₱
                {avgOrder.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-2xl border bg-muted/30 p-5">
              <p className="text-xs text-muted-foreground">
                Items Sold
              </p>

              <p className="mt-2 text-2xl font-bold">
                {itemsSold}
              </p>
            </div>

          </div>
        </DashboardCard>

      </div>

    </section>
  );
}