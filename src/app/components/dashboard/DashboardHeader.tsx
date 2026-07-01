"use client";

import { RefreshCw } from "lucide-react";

export function DashboardHeader() {
  const today = new Date();

  return (
    <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back. Here's an overview of your inventory and sales.
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="rounded-2xl border bg-background px-4 py-3 shadow-sm">
          <p className="text-xs text-muted-foreground">
            Last Updated
          </p>

          <p className="mt-1 text-sm font-medium">
            {today.toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600">

          <RefreshCw className="h-4 w-4" />

          Live
        </div>

      </div>
    </header>
  );
}