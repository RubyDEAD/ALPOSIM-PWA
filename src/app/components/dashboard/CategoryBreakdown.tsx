'use client';

import React from 'react';
import { CardContainer } from './CardContainer';
import { Category } from '@/src/types/types';
import { Tags } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface CategoryBreakdownProps {
  categories: Category[];
  productCounts: Record<number, number>;
}

const COLORS = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#22c55e', // green
  '#a855f7', // purple
  '#ef4444', // red
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
];

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

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-md px-3 py-2 text-[12px]">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground mt-0.5">
        <span className="font-semibold text-foreground">{payload[0].value}</span> products
      </p>
    </div>
  );
};

export function CategoryBreakdown({ categories, productCounts }: CategoryBreakdownProps) {
  const data = categories
    .map((cat) => ({
      name: cat.name,
      value: productCounts[cat.id] ?? 0,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <CardContainer
      title="Category Breakdown"
      description="Products per category"
      icon={<Tags className="w-3.5 h-3.5" />}
      badge={`${data.length} categories`}
      contentClassName="px-3 pb-3 pt-2"
    >
      {data.length === 0 ? (
        <div className="h-52 flex items-center justify-center text-[12px] text-muted-foreground">
          No category data available yet.
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={data.length * 36 + 16}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 36, left: 0, bottom: 0 }}
              barSize={14}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />

              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />

              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: '#374151' }}
                axisLine={false}
                tickLine={false}
                width={80}
                tickFormatter={(v: string) => v.length > 10 ? `${v.slice(0, 10)}…` : v}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />

              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Summary row */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/60">
            <p className="text-[11px] text-muted-foreground">
              Total <span className="font-semibold text-foreground">{total}</span> products
            </p>
            <div className="flex gap-2 flex-wrap justify-end">
              {data.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-[10px] text-muted-foreground">{item.name}</span>
                </div>
              ))}
              {data.length > 4 && (
                <span className="text-[10px] text-muted-foreground">+{data.length - 4} more</span>
              )}
            </div>
          </div>
        </>
      )}
    </CardContainer>
  );
}