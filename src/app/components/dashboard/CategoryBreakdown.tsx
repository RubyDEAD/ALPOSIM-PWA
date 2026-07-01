'use client';

import React from 'react';
import { Tags } from 'lucide-react';
import { Category } from '@/src/types/types';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface CategoryBreakdownProps {
  categories: Category[];
  productCounts: Record<number, number>;
}

const COLORS = [
  '#F59E0B',
  '#3B82F6',
  '#22C55E',
  '#A855F7',
  '#EF4444',
  '#14B8A6',
  '#F97316',
  '#6366F1',
];

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border bg-background p-3 shadow-lg">
      <p className="text-sm font-medium">{label}</p>

      <p className="mt-1 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          {payload[0].value}
        </span>{' '}
        products
      </p>
    </div>
  );
}

export function CategoryBreakdown({
  categories,
  productCounts,
}: CategoryBreakdownProps) {
  const data = categories
    .map((category) => ({
      name: category.name,
      value: productCounts[category.id] ?? 0,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const totalProducts = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-xl p-3">
      <div className=" flex items-start justify-between">
      </div>

      {data.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
          No category data available.
        </div>
      ) : (
        <>
          <div className="h-[320px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  top: 0,
                  right: 16,
                  left: 12,
                  bottom: 0,
                }}
                barSize={16}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 12,
                  }}
                  tickFormatter={(value: string) =>
                    value.length > 12
                      ? `${value.slice(0, 12)}...`
                      : value
                  }
                />

                <Tooltip
                  cursor={{
                    fill: "#f8fafc",
                  }}
                  content={<CustomTooltip />}
                />

                <Bar
                  dataKey="value"
                  radius={[0, 8, 8, 0]}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Total Products
              </p>

              <p className="text-xl font-bold">
                {totalProducts}
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              {data.slice(0, 4).map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="text-xs text-muted-foreground">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}