'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CategoryBreakdownChartProps {
  transactions: Transaction[];
}

const CATEGORY_COLORS = [
  '#059669', // Emerald
  '#2563EB', // Blue
  '#D97706', // Amber
  '#7C3AED', // Purple
  '#DC2626', // Red
  '#0891B2', // Cyan
  '#475569', // Slate
];

export function CategoryBreakdownChart({ transactions }: CategoryBreakdownChartProps) {
  const categoryData = useMemo(() => {
    if (!transactions.length) return [];

    const map = new Map<string, number>();
    let total = 0;

    transactions.forEach((t) => {
      if (t.amount <= 0) return;
      const cat = t.category || 'General';
      const prev = map.get(cat) || 0;
      map.set(cat, prev + t.amount);
      total += t.amount;
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        percent: total > 0 ? Math.round((value / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Expense Breakdown</h3>
        <p className="text-xs text-slate-500">Spending distribution across categories</p>
      </div>

      {categoryData.length > 0 ? (
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md">
                          <p className="font-semibold text-slate-800">{data.name}</p>
                          <p className="text-slate-600 font-bold mt-0.5">
                            {formatCurrency(data.value)} ({data.percent}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 w-full space-y-2">
            {categoryData.slice(0, 5).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                  />
                  <span className="text-slate-700 truncate font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-slate-900">{formatCurrency(item.value)}</span>
                  <span className="text-slate-400 text-[10px] w-7 text-right">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400">
          No category data to display.
        </div>
      )}
    </div>
  );
}
