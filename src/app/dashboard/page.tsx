'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  AlertOctagon,
  Repeat,
  ArrowUpRight,
  ShieldAlert,
  FileSpreadsheet,
  ChevronRight,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store/app-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ExpenseTrendsChart } from '@/components/dashboard/expense-trends-chart';
import { CategoryBreakdownChart } from '@/components/dashboard/category-breakdown-chart';
import { FindingDetailModal } from '@/components/leaks/finding-detail-modal';
import { Finding } from '@/types';

export default function DashboardPage() {
  const { workspace, transactions, findings, metrics, isDemoMode, isLoaded } = useAppStore();
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  // Active findings requiring attention (new or investigating)
  const activeFindings = findings.filter(
    (f) => f.review_status === 'new' || f.review_status === 'investigating'
  );

  // Recent 6 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    .slice(0, 6);

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-slate-500 animate-pulse">Loading financial intelligence...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <FindingDetailModal
        finding={selectedFinding}
        isOpen={Boolean(selectedFinding)}
        onClose={() => setSelectedFinding(null)}
      />

      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Expense overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review spending patterns and findings in{' '}
              <span className="font-medium text-slate-700">{workspace.name}</span>.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 sm:flex">
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-400" />
            <span>{isDemoMode ? 'Synthetic sample data' : `${transactions.length} imported transactions`}</span>
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        {isDemoMode && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-emerald-100 p-2 text-emerald-700 shrink-0">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-950">Synthetic sample data</p>
                <p className="mt-1 text-xs leading-5 text-emerald-800/80">
                  These example transactions demonstrate the four checks. Your first CSV import replaces them so sample and uploaded records stay separate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* B. Key Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Total Expenses */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Expenses
              </span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(metrics.totalExpenses)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Across {metrics.totalTransactionsCount} imported transactions
            </p>
          </div>

          {/* 2. Potential Savings */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-xs transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Potential Savings
              </span>
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-emerald-900 tracking-tight">
              {formatCurrency(metrics.potentialSavings)}
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              Estimated avoidable charges awaiting investigation
            </p>
          </div>

          {/* 3. Issues to Review */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-5 shadow-xs transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
                Issues to Review
              </span>
              <div className="rounded-lg bg-rose-100 p-2 text-rose-700">
                <AlertOctagon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-rose-900 tracking-tight">
              {metrics.issuesToReviewCount}
            </p>
            <p className="mt-1 text-xs text-rose-700">
              {metrics.issuesToReviewCount > 0
                ? 'Suspicious charges or price hikes'
                : 'All detected findings resolved'}
            </p>
          </div>

          {/* 4. Recurring Expenses */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Recurring Subscriptions
              </span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Repeat className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">
              {formatCurrency(metrics.totalRecurringSpend)}
              <span className="text-xs font-normal text-slate-400">/yr</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Annualized total recurring SaaS commitments
            </p>
          </div>
        </div>

        {/* Charts Section: Spending Trend + Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExpenseTrendsChart transactions={transactions} />
          </div>
          <div>
            <CategoryBreakdownChart transactions={transactions} />
          </div>
        </div>

        {/* D. Findings Requiring Attention */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                Findings Requiring Attention
              </h3>
              <p className="text-xs text-slate-500">
                Suspected duplicate payments, price hikes, and abnormal spending patterns
              </p>
            </div>
            <Link
              href="/leaks"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All ({findings.length}) <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {activeFindings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeFindings.slice(0, 4).map((finding) => (
                <div
                  key={finding.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {finding.merchant}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge
                          variant={
                            finding.priority === 'high'
                              ? 'destructive'
                              : finding.priority === 'medium'
                              ? 'warning'
                              : 'secondary'
                          }
                          className="text-[10px] uppercase font-semibold py-0.5 px-2"
                        >
                          {finding.priority}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-slate-800 line-clamp-1">
                      {finding.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {finding.explanation}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Estimated Impact
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(finding.estimated_impact)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedFinding(finding)}
                      className="text-xs gap-1 h-8"
                    >
                      Review Finding <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-emerald-950">
                No active issues requiring investigation!
              </p>
              <p className="text-xs text-emerald-800/80 mt-1">
                All flagged expenses have been reviewed or no anomalies were detected.
              </p>
            </div>
          )}
        </div>

        {/* F. Recent Transactions Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent Transactions</h3>
              <p className="text-xs text-slate-500">Latest imported ledger records</p>
            </div>
            <Link
              href="/transactions"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              All Transactions ({transactions.length}) <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Merchant</th>
                  <th className="px-4 py-2.5 font-medium">Description</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">
                      {formatDate(tx.transaction_date)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      {tx.merchant}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {tx.category || 'General'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
