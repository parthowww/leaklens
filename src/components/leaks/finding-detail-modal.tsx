'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  HelpCircle,
  FileText,
  DollarSign,
  Send,
  ShieldAlert,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store/app-store';
import { Finding, ReviewStatus, Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface FindingDetailModalProps {
  finding: Finding | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FindingDetailModal({ finding, isOpen, onClose }: FindingDetailModalProps) {
  const { transactions, updateFindingStatus, addFindingNote, findingNotes } = useAppStore();
  const [newNote, setNewNote] = useState('');
  const [confirmStatus, setConfirmStatus] = useState<ReviewStatus | null>(null);

  if (!finding) return null;

  // Retrieve supporting transactions
  const supportingTxs: Transaction[] = transactions.filter((t) =>
    finding.supporting_transaction_ids.includes(t.id)
  );

  // Retrieve notes for this finding
  const notes = findingNotes.filter((n) => n.finding_id === finding.id);

  const getRuleBadge = (ruleType: Finding['rule_type']) => {
    switch (ruleType) {
      case 'duplicate_payment':
        return <Badge variant="destructive">Duplicate Payment</Badge>;
      case 'price_increase':
        return <Badge variant="warning">Price Increase</Badge>;
      case 'unusual_expense':
        return <Badge variant="destructive">Unusual Expense</Badge>;
      case 'recurring_expense':
        return <Badge variant="info">Recurring Expense</Badge>;
      default:
        return <Badge variant="secondary">{ruleType}</Badge>;
    }
  };

  const getPriorityBadge = (priority: Finding['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="secondary">Low Priority</Badge>;
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
        return <Badge variant="secondary">Legitimate Expense</Badge>;
      case 'ignored':
        return <Badge variant="outline">Ignored</Badge>;
    }
  };

  const getActionRecommendations = () => {
    switch (finding.rule_type) {
      case 'duplicate_payment':
        return [
          'Verify your bank or credit card statement to confirm both charges were processed.',
          'Contact the vendor’s billing support or merchant desk with transaction reference numbers to request a refund or credit note.',
          'Check if automated accounting rules or duplicate invoicing created two payment authorizations.',
        ];
      case 'price_increase':
        return [
          'Verify if seat count, usage tier, or enterprise licensing changed.',
          'Check email records for any recent vendor pricing increase notifications.',
          'Negotiate annual lock-in rates or downgrade unused tier add-ons with vendor account rep.',
        ];
      case 'unusual_expense':
        return [
          'Inspect the detailed invoice breakdown for unexpected overage charges, auto-scaling, or tax adjustments.',
          'Confirm with department leads whether an authorized one-off expenditure occurred.',
          'Set up spending alerts or hard budget caps in the vendor’s billing console.',
        ];
      default:
        return ['Review the underlying receipts and verify approval chain.'];
    }
  };

  const handleApplyStatus = (status: ReviewStatus) => {
    updateFindingStatus(finding.id, status);
    setConfirmStatus(null);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addFindingNote(finding.id, newNote);
    setNewNote('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex flex-wrap items-center gap-2">
          <span>{finding.title}</span>
          {getRuleBadge(finding.rule_type)}
          {getPriorityBadge(finding.priority)}
          {getStatusBadge(finding.review_status)}
        </div>
      }
      description={`Detected on ${formatDate(finding.detected_at)} • Vendor: ${finding.merchant}`}
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Potential Financial Impact</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">
              {formatCurrency(finding.estimated_impact)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Evidence Strength:{' '}
              <span className="font-semibold capitalize text-slate-700">
                {finding.evidence_strength}
              </span>
            </p>
          </div>

          {/* Quick Review Status Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 mr-1">Mark Status:</span>
            {(['investigating', 'resolved', 'legitimate', 'ignored'] as ReviewStatus[]).map((st) => (
              <Button
                key={st}
                size="sm"
                variant={finding.review_status === st ? 'default' : 'outline'}
                onClick={() => setConfirmStatus(st)}
                className="capitalize text-xs h-7"
              >
                {st}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Confirmation Prompt */}
        {confirmStatus && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900">
                  Confirm Status Change to &quot;{confirmStatus}&quot;
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  {confirmStatus === 'resolved' &&
                    'This marks the issue as rectified and updates confirmed savings.'}
                  {confirmStatus === 'legitimate' &&
                    'This confirms the charges were expected and excludes it from potential leaks.'}
                  {confirmStatus === 'ignored' &&
                    'This dismisses the finding from active dashboard warnings.'}
                  {confirmStatus === 'investigating' &&
                    'This keeps the finding flagged while someone reviews invoices.'}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" onClick={() => handleApplyStatus(confirmStatus)}>
                    Confirm Change
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setConfirmStatus(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Plain-Language Explanation */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-600" /> Finding Analysis
          </h4>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">{finding.explanation}</p>

          {/* Calculation Breakdown */}
          <div className="mt-4 rounded-lg bg-slate-50 border border-slate-150 p-3.5 text-xs text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-800">Deterministic Arithmetic Breakdown:</p>
            {finding.rule_type === 'duplicate_payment' && (
              <p>
                • <strong>Duplicate Calculation:</strong> 2 matching charges of{' '}
                {formatCurrency(finding.estimated_impact)} detected within window. Only 1 extra
                charge is counted towards investigated leak (₹{finding.estimated_impact.toLocaleString('en-IN')}).
              </p>
            )}
            {finding.rule_type === 'price_increase' && finding.details && (
              <p>
                • <strong>Price Variance:</strong> Previous median baseline:{' '}
                {formatCurrency(finding.details.previous_amount || 0)} → New amount:{' '}
                {formatCurrency(finding.details.new_amount || 0)} (+
                {finding.details.percentage_increase}%). Net monthly delta:{' '}
                {formatCurrency(finding.estimated_impact)}.
              </p>
            )}
            {finding.rule_type === 'unusual_expense' && finding.details && (
              <p>
                • <strong>Baseline Deviation:</strong> Historical median of{' '}
                {formatCurrency(finding.details.baseline_median || 0)}. Outlier charge of{' '}
                {formatCurrency((finding.details.baseline_median || 0) + finding.estimated_impact)}{' '}
                exceeds expected pattern by {finding.details.deviation_percent}%.
              </p>
            )}
          </div>
        </div>

        {/* Supporting Transactions Evidence Table */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-600" /> Supporting Transaction Evidence (
            {supportingTxs.length})
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-2.5 font-medium">Date</th>
                  <th className="px-3.5 py-2.5 font-medium">Merchant</th>
                  <th className="px-3.5 py-2.5 font-medium">Description</th>
                  <th className="px-3.5 py-2.5 font-medium">Reference ID</th>
                  <th className="px-3.5 py-2.5 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {supportingTxs.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50">
                    <td className="px-3.5 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                      {formatDate(tx.transaction_date)}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-700 whitespace-nowrap font-medium">
                      {tx.merchant}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-500 font-mono text-[11px]">
                      {tx.reference_id || '—'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-semibold text-slate-900 whitespace-nowrap">
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Action Next Steps */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
          <h4 className="text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> Recommended Action Next Steps
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
            {getActionRecommendations().map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Notes & Audit Trail Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900">Audit Notes & History</h4>

          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              placeholder="Add an internal note or vendor ticket number..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-hidden"
            />
            <Button size="sm" type="submit" disabled={!newNote.trim()} className="gap-1 text-xs">
              <Send className="h-3.5 w-3.5" /> Post Note
            </Button>
          </form>

          {notes.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {notes.map((n) => (
                <div key={n.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs">
                  <div className="flex justify-between text-slate-500 text-[11px] mb-1">
                    <span className="font-semibold text-slate-700">{n.user_name}</span>
                    <span>{formatDate(n.created_at)}</span>
                  </div>
                  <p className="text-slate-800">{n.note}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No notes added yet.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
