'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useAppStore } from '@/lib/store/app-store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Transaction } from '@/types';

export default function TransactionsPage() {
  const { transactions, importBatches, findings, deleteTransaction, deleteBatch } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [flaggedFilter, setFlaggedFilter] = useState<'all' | 'flagged' | 'clean'>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'merchant'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modals for deletion confirmation
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [batchToDelete, setBatchToDelete] = useState<string | null>(null);

  // Set of transaction IDs that triggered findings
  const flaggedTxIds = useMemo(() => {
    const ids = new Set<string>();
    findings.forEach((f) => {
      f.supporting_transaction_ids.forEach((id) => ids.add(id));
    });
    return ids;
  }, [findings]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  // Filter and Sort
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search term
        const matchesSearch =
          t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.reference_id && t.reference_id.toLowerCase().includes(searchTerm.toLowerCase()));

        // Category filter
        const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;

        // Batch filter
        const matchesBatch = selectedBatch === 'all' || t.import_batch_id === selectedBatch;

        // Flagged filter
        const isFlagged = flaggedTxIds.has(t.id);
        const matchesFlag =
          flaggedFilter === 'all' ||
          (flaggedFilter === 'flagged' && isFlagged) ||
          (flaggedFilter === 'clean' && !isFlagged);

        return matchesSearch && matchesCategory && matchesBatch && matchesFlag;
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          const diff = new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
          return sortOrder === 'asc' ? diff : -diff;
        } else if (sortField === 'amount') {
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        } else {
          return sortOrder === 'asc'
            ? a.merchant.localeCompare(b.merchant)
            : b.merchant.localeCompare(a.merchant);
        }
      });
  }, [
    transactions,
    searchTerm,
    selectedCategory,
    selectedBatch,
    flaggedFilter,
    sortField,
    sortOrder,
    flaggedTxIds,
  ]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: 'date' | 'amount' | 'merchant') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleConfirmDeleteTx = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  const handleConfirmDeleteBatch = () => {
    if (batchToDelete) {
      deleteBatch(batchToDelete);
      setBatchToDelete(null);
    }
  };

  return (
    <AppShell>
      {/* Delete Tx Confirmation Modal */}
      <Modal
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        title="Delete Transaction"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete this transaction from{' '}
            <strong className="text-slate-800">{txToDelete?.merchant}</strong> (
            {formatCurrency(txToDelete?.amount || 0)})?
          </p>
          <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            Deleting this transaction will trigger an automatic re-evaluation of all detection rules
            and recalculate related leak alerts.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setTxToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmDeleteTx}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Batch Confirmation Modal */}
      <Modal
        isOpen={Boolean(batchToDelete)}
        onClose={() => setBatchToDelete(null)}
        title="Delete Entire Import Batch"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete all transactions imported in this batch? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setBatchToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmDeleteBatch}>
              Confirm Delete Batch
            </Button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Transactions Ledger
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, filter, and inspect all {transactions.length} expense records.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search merchant, description, reference ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Flagged Status Filter */}
            <select
              value={flaggedFilter}
              onChange={(e) => {
                setFlaggedFilter(e.target.value as 'all' | 'flagged' | 'clean');
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Detection Statuses</option>
              <option value="flagged">Flagged in Findings Only</option>
              <option value="clean">Clean / Unflagged</option>
            </select>

            {/* Batch Filter */}
            {importBatches.length > 1 && (
              <select
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="all">All Import Batches</option>
                {importBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.filename} ({b.row_count} rows)
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 select-none">
                <tr>
                  <th
                    onClick={() => toggleSort('date')}
                    className="px-4 py-3 font-semibold hover:text-slate-900 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Date</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('merchant')}
                    className="px-4 py-3 font-semibold hover:text-slate-900 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Merchant</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th
                    onClick={() => toggleSort('amount')}
                    className="px-4 py-3 font-semibold hover:text-slate-900 cursor-pointer text-right"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Amount</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((tx) => {
                    const isFlagged = flaggedTxIds.has(tx.id);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
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
                          <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                            {tx.category || 'General'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {isFlagged ? (
                            <Badge variant="destructive" className="gap-1 text-[10px] py-0 px-2">
                              <ShieldAlert className="h-3 w-3" /> Flagged
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-slate-400">Normal</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => setTxToDelete(tx)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete transaction"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-400">
                      No matching transactions found with the active filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
              {filteredTransactions.length} transactions
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="text-xs h-7 px-2.5"
              >
                Previous
              </Button>
              <span className="text-xs text-slate-600 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="text-xs h-7 px-2.5"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
