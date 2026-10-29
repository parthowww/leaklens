'use client';

import React, { useState, useMemo } from 'react';
import {
  Repeat,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store/app-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RecurringReviewStatus, RecurringExpenseItem } from '@/types';

export default function RecurringExpensesPage() {
  const { recurringExpenses, updateRecurringStatus } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRecurring = useMemo(() => {
    return recurringExpenses.filter((item) => {
      const matchesSearch =
        item.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.review_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [recurringExpenses, searchTerm, statusFilter]);

  const totalAnnualRecurring = useMemo(() => {
    return recurringExpenses.reduce((acc, curr) => acc + curr.estimated_annual_cost, 0);
  }, [recurringExpenses]);

  const getStatusBadge = (status: RecurringReviewStatus) => {
    switch (status) {
      case 'expected':
        return <Badge variant="secondary">Expected Active</Badge>;
      case 'needs_investigation':
        return <Badge variant="warning">Needs Investigation</Badge>;
      case 'no_longer_used':
        return <Badge variant="destructive">No Longer Used</Badge>;
      case 'incorrect_detection':
        return <Badge variant="outline">Incorrect Detection</Badge>;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Recurring Expenses & Subscriptions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track repeated vendor debits, calculate annualized commitments, and flag forgotten
              subscriptions.
            </p>
          </div>
        </div>

        {/* Top Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Total Annualized Subscriptions</span>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(totalAnnualRecurring)}
              <span className="text-xs font-normal text-slate-400">/year</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Across {recurringExpenses.length} recurring vendors
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
            <span className="text-xs text-amber-800 font-medium">To Investigate / Unused</span>
            <p className="mt-1 text-2xl font-bold text-amber-950">
              {
                recurringExpenses.filter(
                  (r) =>
                    r.review_status === 'needs_investigation' ||
                    r.review_status === 'no_longer_used'
                ).length
              }
            </p>
            <p className="text-[11px] text-amber-700 mt-1">
              Marked for cancellation or review
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
            <span className="text-xs text-emerald-800 font-medium">Expected Business Subscriptions</span>
            <p className="mt-1 text-2xl font-bold text-emerald-950">
              {recurringExpenses.filter((r) => r.review_status === 'expected').length}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1">
              Confirmed legitimate ongoing tools
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search subscription merchant or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
          >
            <option value="all">All Review Statuses</option>
            <option value="expected">Expected</option>
            <option value="needs_investigation">Needs Investigation</option>
            <option value="no_longer_used">No Longer Used</option>
            <option value="incorrect_detection">Incorrect Detection</option>
          </select>
        </div>

        {/* Recurring Expenses Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Vendor / Service</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Cadence</th>
                  <th className="px-4 py-3 font-semibold">Typical Charge</th>
                  <th className="px-4 py-3 font-semibold">Last Paid</th>
                  <th className="px-4 py-3 font-semibold text-right">Est. Annual Cost</th>
                  <th className="px-4 py-3 font-semibold">Review Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Set Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRecurring.length > 0 ? (
                  filteredRecurring.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                        {item.merchant}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-700 whitespace-nowrap">
                        {item.billing_frequency}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                        {formatCurrency(item.typical_amount)}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {formatDate(item.last_observed_date)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(item.estimated_annual_cost)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(item.review_status)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <select
                          value={item.review_status}
                          onChange={(e) =>
                            updateRecurringStatus(
                              item.id,
                              e.target.value as RecurringReviewStatus
                            )
                          }
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 focus:border-emerald-500 focus:outline-hidden"
                        >
                          <option value="expected">Expected</option>
                          <option value="needs_investigation">Needs Investigation</option>
                          <option value="no_longer_used">No Longer Used</option>
                          <option value="incorrect_detection">Incorrect</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-xs text-slate-400">
                      No recurring expenses detected matching current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
