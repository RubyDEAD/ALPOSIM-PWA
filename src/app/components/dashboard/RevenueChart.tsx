'use client';

import React from 'react';
import { DailyReport } from '@/src/types/types';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  data: DailyReport[];
}

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

// Custom tooltip
const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-md px-3 py-2.5 text-[12px] space-y-1">
      <p className="font-medium text-foreground mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.name}</span>
          </div>
          <span className="font-medium text-foreground">
            ₱{Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
};

function formatDate(raw: string): string {
  if (!raw) return "";
  const normalized = raw.includes("T") && !raw.endsWith("Z") && !raw.includes("+") ? `${raw}Z` : raw;
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RevenueChart({ data }: RevenueChartProps) {
  const totalRevenue = data.reduce((acc, d) => acc + (d.totalRevenue ?? 0), 0);
  const totalProfit = data.reduce((acc, d) => acc + (d.totalProfit ?? 0), 0);
  const profitMargin = totalRevenue > 0 && !isNaN(totalProfit / totalRevenue)
    ? ((totalProfit / totalRevenue) * 100).toFixed(1)
    : '0.0';

  const chartData = data.map((d) => ({
    date: formatDate(d.date),
    revenue: d.totalRevenue ?? 0,
    profit: d.totalProfit ?? 0,
  }));

  return (
    <div className="rounded-xl p-4 min-h-[300px]">
      <div className="mb-4 flex items-start justify-between gap-4">  
        <div className="space-y-1">  
        </div>

        {/* Action area displaying dynamic financial highlights */}
        <div className="flex items-center gap-3 text-[11px] shrink-0">
          <div className="text-right">
            <p className="text-muted-foreground">Total Revenue</p>
            <p className="font-semibold text-foreground">
              ₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Margin</p>
            <p className="font-semibold text-green-600">{profitMargin}%</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-2 pb-2 pt-2 min-h-[350px] flex flex-col justify-between">
        {data.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-[12px] text-muted-foreground">
            No report data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />

              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
                width={44}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#gradRevenue)"
                dot={false}
                activeDot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#gradProfit)"
                dot={false}
                activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[2px] bg-amber-400 rounded-full" />
            <span className="text-[11px] text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[2px] bg-green-500 rounded-full" />
            <span className="text-[11px] text-muted-foreground">Profit</span>
          </div>
        </div>
      </div>
    </div>
  );
}