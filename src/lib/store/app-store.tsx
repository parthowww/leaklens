'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type {
  Transaction,
  Finding,
  RecurringExpenseItem,
  ImportBatch,
  FindingNote,
  Workspace,
  DetectionConfig,
  SummaryMetrics,
  ReviewStatus,
  RecurringReviewStatus,
} from '@/types';
import {
  DEFAULT_DETECTION_CONFIG,
  runDetectionEngine,
  calculateSummaryMetrics,
} from '@/lib/detection/engine';
import { DEMO_WORKSPACE, DEMO_TRANSACTIONS } from '@/lib/demo-data';

interface AppStoreContextType {
  workspace: Workspace;
  transactions: Transaction[];
  findings: Finding[];
  recurringExpenses: RecurringExpenseItem[];
  importBatches: ImportBatch[];
  findingNotes: FindingNote[];
  detectionConfig: DetectionConfig;
  isDemoMode: boolean;
  metrics: SummaryMetrics;
  isLoaded: boolean;

  // Actions
  importTransactions: (
    filename: string,
    rawTransactions: Omit<Transaction, 'id' | 'workspace_id' | 'import_batch_id' | 'created_at'>[]
  ) => { batchId: string; importedCount: number; newFindingsCount: number };
  updateFindingStatus: (findingId: string, status: ReviewStatus, optionalNote?: string) => void;
  addFindingNote: (findingId: string, noteText: string) => void;
  updateRecurringStatus: (recurringId: string, status: RecurringReviewStatus) => void;
  deleteTransaction: (transactionId: string) => void;
  deleteBatch: (batchId: string) => void;
  resetToDemoData: () => void;
  clearAllData: () => void;
  updateDetectionConfig: (config: Partial<DetectionConfig>) => void;
  updateWorkspace: (name: string, currency?: string) => void;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

const STORAGE_KEY_PREFIX = 'leaklens_app_data_';

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace>(DEMO_WORKSPACE);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpenseItem[]>([]);
  const [importBatches, setImportBatches] = useState<ImportBatch[]>([]);
  const [findingNotes, setFindingNotes] = useState<FindingNote[]>([]);
  const [detectionConfig, setDetectionConfig] = useState<DetectionConfig>(DEFAULT_DETECTION_CONFIG);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize from LocalStorage or seed with Demo Data
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(`${STORAGE_KEY_PREFIX}config`);
      const savedWs = localStorage.getItem(`${STORAGE_KEY_PREFIX}ws`);
      const savedTxs = localStorage.getItem(`${STORAGE_KEY_PREFIX}txs`);
      const savedFindings = localStorage.getItem(`${STORAGE_KEY_PREFIX}findings`);
      const savedBatches = localStorage.getItem(`${STORAGE_KEY_PREFIX}batches`);
      const savedNotes = localStorage.getItem(`${STORAGE_KEY_PREFIX}notes`);

      const configToUse = savedConfig ? JSON.parse(savedConfig) : DEFAULT_DETECTION_CONFIG;
      setDetectionConfig(configToUse);

      if (savedTxs) {
        const parsedTxs: Transaction[] = JSON.parse(savedTxs);
        const parsedWs: Workspace = savedWs ? JSON.parse(savedWs) : DEMO_WORKSPACE;
        const parsedFindings: Finding[] = savedFindings ? JSON.parse(savedFindings) : [];
        const parsedBatches: ImportBatch[] = savedBatches ? JSON.parse(savedBatches) : [];
        const parsedNotes: FindingNote[] = savedNotes ? JSON.parse(savedNotes) : [];

        setWorkspace(parsedWs);
        setTransactions(parsedTxs);
        setImportBatches(parsedBatches);
        setFindingNotes(parsedNotes);
        setIsDemoMode(parsedWs.id === DEMO_WORKSPACE.id);

        // Recompute engine findings
        const { findings: engineFindings, recurringExpenses: recList } = runDetectionEngine(
          parsedTxs,
          parsedFindings,
          configToUse
        );
        setFindings(engineFindings);
        setRecurringExpenses(recList);
      } else {
        // First visit: Seed with realistic synthetic demo dataset!
        const initialBatch: ImportBatch = {
          id: 'batch-demo-oct',
          workspace_id: DEMO_WORKSPACE.id,
          filename: 'october_2026_expenses.csv',
          row_count: DEMO_TRANSACTIONS.length,
          valid_row_count: DEMO_TRANSACTIONS.length,
          rejected_row_count: 0,
          status: 'completed',
          imported_at: '2026-10-25T10:00:00Z',
        };

        const { findings: initialFindings, recurringExpenses: initialRec } = runDetectionEngine(
          DEMO_TRANSACTIONS,
          [],
          configToUse
        );

        setWorkspace(DEMO_WORKSPACE);
        setTransactions(DEMO_TRANSACTIONS);
        setImportBatches([initialBatch]);
        setFindings(initialFindings);
        setRecurringExpenses(initialRec);
        setIsDemoMode(true);
      }
    } catch (e) {
      console.error('Failed to load store from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}ws`, JSON.stringify(workspace));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}txs`, JSON.stringify(transactions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}findings`, JSON.stringify(findings));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}batches`, JSON.stringify(importBatches));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}notes`, JSON.stringify(findingNotes));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}config`, JSON.stringify(detectionConfig));
    } catch (e) {
      console.error('Failed to sync state to localStorage', e);
    }
  }, [workspace, transactions, findings, importBatches, findingNotes, detectionConfig, isLoaded]);

  // Deterministic Summary Metrics
  const metrics = useMemo(() => {
    return calculateSummaryMetrics(transactions, findings, recurringExpenses);
  }, [transactions, findings, recurringExpenses]);

  // Import New CSV Transactions
  const importTransactions = useCallback(
    (
      filename: string,
      rawTransactions: Omit<Transaction, 'id' | 'workspace_id' | 'import_batch_id' | 'created_at'>[]
    ) => {
      const batchId = `batch-${Date.now()}`;
      const newBatch: ImportBatch = {
        id: batchId,
        workspace_id: workspace.id,
        filename,
        row_count: rawTransactions.length,
        valid_row_count: rawTransactions.length,
        rejected_row_count: 0,
        status: 'completed',
        imported_at: new Date().toISOString(),
      };

      const formattedTxs: Transaction[] = rawTransactions.map((t, idx) => ({
        ...t,
        id: `tx-${Date.now()}-${idx}`,
        workspace_id: workspace.id,
        import_batch_id: batchId,
        created_at: new Date().toISOString(),
      }));

      const allTxs = [...transactions, ...formattedTxs];
      const { findings: updatedFindings, recurringExpenses: updatedRec } = runDetectionEngine(
        allTxs,
        findings,
        detectionConfig
      );

      const newFindingsCount = updatedFindings.filter((f) => f.review_status === 'new').length;

      setImportBatches((prev) => [newBatch, ...prev]);
      setTransactions(allTxs);
      setFindings(updatedFindings);
      setRecurringExpenses(updatedRec);

      return {
        batchId,
        importedCount: formattedTxs.length,
        newFindingsCount,
      };
    },
    [workspace.id, transactions, findings, detectionConfig]
  );

  // Update Finding Review Status
  const updateFindingStatus = useCallback(
    (findingId: string, status: ReviewStatus, optionalNote?: string) => {
      setFindings((prev) =>
        prev.map((f) => {
          if (f.id === findingId) {
            return {
              ...f,
              review_status: status,
              updated_at: new Date().toISOString(),
              user_notes: optionalNote ? `${f.user_notes ? f.user_notes + '\n' : ''}${optionalNote}` : f.user_notes,
            };
          }
          return f;
        })
      );

      if (optionalNote) {
        const newNote: FindingNote = {
          id: `note-${Date.now()}`,
          finding_id: findingId,
          user_id: 'current-user',
          user_name: 'Business Owner',
          note: `Status changed to "${status}": ${optionalNote}`,
          created_at: new Date().toISOString(),
        };
        setFindingNotes((prev) => [newNote, ...prev]);
      }
    },
    []
  );

  // Add a user note to a finding
  const addFindingNote = useCallback((findingId: string, noteText: string) => {
    if (!noteText.trim()) return;
    const newNote: FindingNote = {
      id: `note-${Date.now()}`,
      finding_id: findingId,
      user_id: 'current-user',
      user_name: 'Business Owner',
      note: noteText.trim(),
      created_at: new Date().toISOString(),
    };
    setFindingNotes((prev) => [newNote, ...prev]);

    setFindings((prev) =>
      prev.map((f) => {
        if (f.id === findingId) {
          const updated = f.user_notes ? `${f.user_notes}\n${noteText.trim()}` : noteText.trim();
          return { ...f, user_notes: updated, updated_at: new Date().toISOString() };
        }
        return f;
      })
    );
  }, []);

  // Update Recurring Expense status
  const updateRecurringStatus = useCallback(
    (recurringId: string, status: RecurringReviewStatus) => {
      setRecurringExpenses((prev) =>
        prev.map((item) => (item.id === recurringId ? { ...item, review_status: status } : item))
      );
    },
    []
  );

  // Delete a single transaction
  const deleteTransaction = useCallback(
    (transactionId: string) => {
      const filtered = transactions.filter((t) => t.id !== transactionId);
      setTransactions(filtered);
      const { findings: updatedFindings, recurringExpenses: updatedRec } = runDetectionEngine(
        filtered,
        findings,
        detectionConfig
      );
      setFindings(updatedFindings);
      setRecurringExpenses(updatedRec);
    },
    [transactions, findings, detectionConfig]
  );

  // Delete an entire import batch
  const deleteBatch = useCallback(
    (batchId: string) => {
      const remainingTxs = transactions.filter((t) => t.import_batch_id !== batchId);
      const remainingBatches = importBatches.filter((b) => b.id !== batchId);
      setTransactions(remainingTxs);
      setImportBatches(remainingBatches);
      const { findings: updatedFindings, recurringExpenses: updatedRec } = runDetectionEngine(
        remainingTxs,
        findings,
        detectionConfig
      );
      setFindings(updatedFindings);
      setRecurringExpenses(updatedRec);
    },
    [transactions, importBatches, findings, detectionConfig]
  );

  // Reset to Demo Data
  const resetToDemoData = useCallback(() => {
    const initialBatch: ImportBatch = {
      id: 'batch-demo-oct',
      workspace_id: DEMO_WORKSPACE.id,
      filename: 'october_2026_expenses.csv',
      row_count: DEMO_TRANSACTIONS.length,
      valid_row_count: DEMO_TRANSACTIONS.length,
      rejected_row_count: 0,
      status: 'completed',
      imported_at: '2026-10-25T10:00:00Z',
    };

    const { findings: initialFindings, recurringExpenses: initialRec } = runDetectionEngine(
      DEMO_TRANSACTIONS,
      [],
      DEFAULT_DETECTION_CONFIG
    );

    setWorkspace(DEMO_WORKSPACE);
    setTransactions(DEMO_TRANSACTIONS);
    setImportBatches([initialBatch]);
    setFindings(initialFindings);
    setRecurringExpenses(initialRec);
    setFindingNotes([]);
    setDetectionConfig(DEFAULT_DETECTION_CONFIG);
    setIsDemoMode(true);
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    setTransactions([]);
    setFindings([]);
    setRecurringExpenses([]);
    setImportBatches([]);
    setFindingNotes([]);
    setIsDemoMode(false);
  }, []);

  // Update detection thresholds
  const updateDetectionConfig = useCallback(
    (partialConfig: Partial<DetectionConfig>) => {
      const newConfig = { ...detectionConfig, ...partialConfig };
      setDetectionConfig(newConfig);
      const { findings: updatedFindings, recurringExpenses: updatedRec } = runDetectionEngine(
        transactions,
        findings,
        newConfig
      );
      setFindings(updatedFindings);
      setRecurringExpenses(updatedRec);
    },
    [detectionConfig, transactions, findings]
  );

  // Update workspace info
  const updateWorkspace = useCallback((name: string, currency = 'INR') => {
    setWorkspace((prev) => ({
      ...prev,
      name,
      currency,
    }));
  }, []);

  return (
    <AppStoreContext.Provider
      value={{
        workspace,
        transactions,
        findings,
        recurringExpenses,
        importBatches,
        findingNotes,
        detectionConfig,
        isDemoMode,
        metrics,
        isLoaded,
        importTransactions,
        updateFindingStatus,
        addFindingNote,
        updateRecurringStatus,
        deleteTransaction,
        deleteBatch,
        resetToDemoData,
        clearAllData,
        updateDetectionConfig,
        updateWorkspace,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
}
