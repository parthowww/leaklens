'use client';

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ExpenseTrendsChartProps {
  transactions: Transaction[];
}

export function ExpenseTrendsChart({ transactions }: ExpenseTrendsChartProps) {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('all');

  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Sort transactions by date
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
    );

    // Filter by period relative to latest transaction in dataset
    const latestTxTime = sorted.length
      ? new Date(sorted[sorted.length - 1].transaction_date).getTime()
      : 0;

    let cutoffTime = 0;
    if (period === '7d') cutoffTime = latestTxTime - 7 * 24 * 60 * 60 * 1000;
    else if (period === '30d') cutoffTime = latestTxTime - 30 * 24 * 60 * 60 * 1000;
    else if (period === '90d') cutoffTime = latestTxTime - 90 * 24 * 60 * 60 * 1000;

    const filtered =
      period === 'all'
        ? sorted
        : sorted.filter((t) => new Date(t.transaction_date).getTime() >= cutoffTime);

    // Group by date
    const dateMap = new Map<string, number>();
    filtered.forEach((t) => {
      const current = dateMap.get(t.transaction_date) || 0;
      dateMap.set(t.transaction_date, current + t.amount);
    });

    const points = Array.from(dateMap.entries()).map(([date, total]) => ({
      date,
      formattedDate: formatDate(date),
      total,
    }));

    return points;
  }, [transactions, period]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Expense Spending Trend</h3>
          <p className="text-xs text-slate-500">Daily spending volume across all imported statements</p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg self-start sm:self-auto">
          {(['7d', '30d', '90d', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                period === p
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => {
                  try {
                    const parts = val.split('-');
                    return `${parts[2]}/${parts[1]}`;
                  } catch {
                    return val;
                  }
                }}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(val) => `₹${val > 999 ? (val / 1000).toFixed(0) + 'k' : val}`}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-md text-xs">
                        <p className="font-medium text-slate-500">{data.formattedDate}</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">
                          {formatCurrency(data.total)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#spendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No transaction records available for this time window.
          </div>
        )}
      </div>
    </div>
  );
}
