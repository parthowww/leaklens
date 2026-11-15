'use client';

import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  Info,
  Calendar,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store/app-store';
import { FindingDetailModal } from '@/components/leaks/finding-detail-modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Finding, DetectionRuleType, ReviewStatus, FindingPriority } from '@/types';

export default function LeaksPage() {
  const { findings, metrics } = useAppStore();
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  const [ruleFilter, setRuleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      const matchesSearch =
        f.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.explanation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRule = ruleFilter === 'all' || f.rule_type === ruleFilter;
      const matchesStatus = statusFilter === 'all' || f.review_status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || f.priority === priorityFilter;

      return matchesSearch && matchesRule && matchesStatus && matchesPriority;
    });
  }, [findings, searchTerm, ruleFilter, statusFilter, priorityFilter]);

  const getRuleBadge = (ruleType: DetectionRuleType) => {
    switch (ruleType) {
      case 'duplicate_payment':
        return <Badge variant="destructive">Duplicate Payment</Badge>;
      case 'price_increase':
        return <Badge variant="warning">Price Hike</Badge>;
      case 'unusual_expense':
        return <Badge variant="destructive">Unusual Surge</Badge>;
      case 'recurring_expense':
        return <Badge variant="info">Subscription</Badge>;
      default:
        return <Badge variant="secondary">{ruleType}</Badge>;
    }
  };

  const getPriorityBadge = (priority: FindingPriority) => {
    switch (priority) {
      case 'high':
        return (
          <Badge variant="destructive" className="uppercase text-[10px] py-0 px-1.5 font-bold">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="warning" className="uppercase text-[10px] py-0 px-1.5 font-bold">
            Med
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="secondary" className="uppercase text-[10px] py-0 px-1.5 font-bold">
            Low
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline">New</Badge>;
      case 'investigating':
        return <Badge variant="warning">Investigating</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved / Saved</Badge>;
      case 'legitimate':
        return <Badge variant="secondary">Legitimate</Badge>;
      case 'ignored':
        return <Badge variant="outline">Ignored</Badge>;
    }
  };

  return (
    <AppShell>
      <FindingDetailModal
        finding={selectedFinding}
        isOpen={Boolean(selectedFinding)}
        onClose={() => setSelectedFinding(null)}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Findings to review
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review possible duplicate charges, price changes and unusual spending. Open a finding to inspect its transaction evidence.
            </p>
          </div>
        </div>

        {/* Financial Leak Opportunity Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <span className="text-xs text-emerald-800 font-medium">
              Potential savings · needs review
            </span>
            <p className="mt-1 text-2xl font-bold text-emerald-950">
              {formatCurrency(metrics.potentialSavings)}
            </p>
            <p className="text-[11px] text-emerald-700 mt-1">
              {metrics.issuesToReviewCount} active findings awaiting confirmation
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="text-xs text-slate-500 font-medium">Confirmed Recovered / Saved</span>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatCurrency(metrics.confirmedSavings)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Marked resolved or refunded
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <span className="text-xs text-slate-500 font-medium">Total Flagged Rules</span>
            <p className="mt-1 text-2xl font-bold text-slate-900">{findings.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Findings identified by the rules
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search vendor or finding"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search findings by vendor or title" className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Rule Type */}
            <select
              value={ruleFilter}
              onChange={(e) => setRuleFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Rule Types</option>
              <option value="duplicate_payment">Duplicate Payments</option>
              <option value="price_increase">Vendor Price Increases</option>
              <option value="unusual_expense">Unusual Outliers</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Review Statuses</option>
              <option value="new">New (Unreviewed)</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="legitimate">Legitimate</option>
              <option value="ignored">Ignored</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Findings List */}
        <div className="space-y-3">
          {filteredFindings.length > 0 ? (
            filteredFindings.map((finding) => (
              <div
                key={finding.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{finding.merchant}</span>
                    {getRuleBadge(finding.rule_type)}
                    {getPriorityBadge(finding.priority)}
                    {getStatusBadge(finding.review_status)}
                    <span className="text-[11px] text-slate-400">
                      Detected {formatDate(finding.detected_at)}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">{finding.title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {finding.explanation}
                  </p>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="md:text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Potential Impact
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {formatCurrency(finding.estimated_impact)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedFinding(finding)}
                    className="text-xs gap-1.5 h-8 border-slate-300"
                  >
                    Review Finding <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">No findings matched your criteria</p>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing search terms or selecting different filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
