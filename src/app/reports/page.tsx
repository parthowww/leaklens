'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  FileDown,
  Printer,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store/app-store';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const { workspace, transactions, findings, recurringExpenses, metrics } = useAppStore();
  const [reportDateRange, setReportDateRange] = useState<'30d' | '90d' | 'all'>('all');

  const [generationTimestamp, setGenerationTimestamp] = useState('');

  useEffect(() => {
    setGenerationTimestamp(
      new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }, []);

  // Category breakdown calculation
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    transactions.forEach((t) => {
      const cat = t.category || 'General';
      map.set(cat, (map.get(cat) || 0) + t.amount);
    });
    return Array.from(map.entries())
      .map(([name, total]) => ({
        name,
        total,
        percentage:
          metrics.totalExpenses > 0 ? Math.round((total / metrics.totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [transactions, metrics.totalExpenses]);

  // Export CSV of Findings
  const handleExportFindingsCSV = () => {
    const headers = [
      'Finding ID',
      'Rule Type',
      'Merchant',
      'Title',
      'Explanation',
      'Priority',
      'Evidence Strength',
      'Estimated Impact (INR)',
      'Review Status',
      'Detected At',
    ];

    const rows = findings.map((f) => [
      `"${f.id}"`,
      `"${f.rule_type}"`,
      `"${f.merchant.replace(/"/g, '""')}"`,
      `"${f.title.replace(/"/g, '""')}"`,
      `"${f.explanation.replace(/"/g, '""')}"`,
      `"${f.priority}"`,
      `"${f.evidence_strength}"`,
      f.estimated_impact,
      `"${f.review_status}"`,
      `"${f.detected_at}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `LeakLens_Audit_Findings_${workspace.name.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export CSV of All Transactions
  const handleExportTransactionsCSV = () => {
    const headers = [
      'Transaction ID',
      'Date',
      'Merchant',
      'Description',
      'Category',
      'Amount (INR)',
      'Reference ID',
    ];

    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.transaction_date}"`,
      `"${t.merchant.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category || 'General'}"`,
      t.amount,
      `"${t.reference_id || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `LeakLens_Transactions_Ledger_${workspace.name.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Financial Leak Audit Report
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Executive summary of detected anomalies, recurring commitments, and non-overlapping
              savings opportunities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportFindingsCSV}
              className="gap-1.5 text-xs h-9"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Findings CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportTransactionsCSV}
              className="gap-1.5 text-xs h-9"
            >
              <FileDown className="h-4 w-4 text-slate-600" /> Export Ledger CSV
            </Button>
            <Button
              size="sm"
              onClick={handlePrintReport}
              className="gap-1.5 text-xs h-9 bg-slate-800 hover:bg-slate-900 text-white"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </Button>
          </div>
        </div>

        {/* Printable Report Paper Container */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-xl text-slate-900">LeakLens</span>
                <span className="rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5">
                  Financial Analysis
                </span>
              </div>
              <p className="text-xs text-slate-500">Generated on {generationTimestamp}</p>
            </div>
            <div className="sm:text-right text-xs text-slate-600 space-y-0.5">
              <p className="font-semibold text-slate-900">{workspace.name}</p>
              <p>Workspace ID: {workspace.id}</p>
              <p>Currency: {workspace.currency}</p>
            </div>
          </div>

          {/* Executive Metrics Overview */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              1. Executive Metrics Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                  Total Expenses
                </span>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {formatCurrency(metrics.totalExpenses)}
                </p>
                <span className="text-[10px] text-slate-400">
                  {metrics.totalTransactionsCount} records
                </span>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                <span className="text-[11px] text-emerald-800 uppercase tracking-wider font-semibold">
                  Potential Savings
                </span>
                <p className="text-xl font-bold text-emerald-950 mt-1">
                  {formatCurrency(metrics.potentialSavings)}
                </p>
                <span className="text-[10px] text-emerald-700">Non-overlapping estimate</span>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                  Confirmed Savings
                </span>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {formatCurrency(metrics.confirmedSavings)}
                </p>
                <span className="text-[10px] text-slate-400">Resolved / Refunded</span>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                  Annual Subscriptions
                </span>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {formatCurrency(metrics.totalRecurringSpend)}
                </p>
                <span className="text-[10px] text-slate-400">
                  {recurringExpenses.length} recurring vendors
                </span>
              </div>
            </div>
          </div>

          {/* 2. Detected Issues & Leak Findings Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              2. Detected Findings & Audit Evidence ({findings.length})
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-3.5 py-2.5 font-semibold">Rule Type</th>
                    <th className="px-3.5 py-2.5 font-semibold">Vendor</th>
                    <th className="px-3.5 py-2.5 font-semibold">Explanation & Evidence</th>
                    <th className="px-3.5 py-2.5 font-semibold">Priority</th>
                    <th className="px-3.5 py-2.5 font-semibold">Status</th>
                    <th className="px-3.5 py-2.5 font-semibold text-right">Potential Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {findings.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/50">
                      <td className="px-3.5 py-2.5 font-medium capitalize text-slate-800 whitespace-nowrap">
                        {f.rule_type.replace('_', ' ')}
                      </td>
                      <td className="px-3.5 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                        {f.merchant}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600 leading-relaxed max-w-md">
                        {f.explanation}
                      </td>
                      <td className="px-3.5 py-2.5 capitalize text-slate-700 whitespace-nowrap">
                        {f.priority}
                      </td>
                      <td className="px-3.5 py-2.5 capitalize text-slate-700 whitespace-nowrap">
                        {f.review_status}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(f.estimated_impact)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Category Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              3. Category Expense Distribution
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name} className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800 truncate">{cat.name}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{cat.percentage}%</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatCurrency(cat.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Methodology & Transparency Statement */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-800">Methodology & Calculations:</p>
            <p>
              • <strong>Duplicate Charges:</strong> Only the incremental extra charge is counted
              towards investigated impact, preventing double-counting.
            </p>
            <p>
              • <strong>Vendor Price Increases:</strong> Evaluated against historical median
              benchmarks for identical vendors with an alert threshold of 15%+.
            </p>
            <p>
              • <strong>Potential Savings:</strong> Only includes non-overlapping active findings
              flagged for owner investigation.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
