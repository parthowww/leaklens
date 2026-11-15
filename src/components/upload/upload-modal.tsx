'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { parseCSVData, autoDetectColumnMapping } from '@/lib/csv/parser';
import { useAppStore } from '@/lib/store/app-store';
import { CSVColumnMapping, CSVParseResult } from '@/types';
import { DEMO_SAMPLE_CSV } from '@/lib/demo-data';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'file-select' | 'column-mapping' | 'validation-summary' | 'completed';

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const { importTransactions, isDemoMode } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('file-select');
  const [fileName, setFileName] = useState<string>('');
  const [csvContent, setCsvContent] = useState<string>('');
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [columnMapping, setColumnMapping] = useState<CSVColumnMapping>({
    date: '',
    merchant: '',
    description: '',
    amount: '',
    category: '',
    reference_id: '',
  });
  const [importSummary, setImportSummary] = useState<{
    importedCount: number;
    newFindingsCount: number;
  } | null>(null);

  const handleReset = () => {
    setStep('file-select');
    setFileName('');
    setCsvContent('');
    setParseResult(null);
    setImportSummary(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Process raw text content from uploaded file or sample
  const processRawCSV = (content: string, name: string) => {
    setCsvContent(content);
    setFileName(name);

    // Initial parse to get headers
    const initial = parseCSVData(content);
    const autoMapping = autoDetectColumnMapping(initial.headers);
    setColumnMapping(autoMapping);

    // Re-parse with detected mapping
    const fullResult = parseCSVData(content, autoMapping);
    setParseResult(fullResult);
    setStep('column-mapping');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a valid .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processRawCSV(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCSV = () => {
    processRawCSV(DEMO_SAMPLE_CSV, 'agency_expenses_sample.csv');
  };

  const handleMappingChange = (key: keyof CSVColumnMapping, value: string) => {
    const updated = { ...columnMapping, [key]: value };
    setColumnMapping(updated);
    if (csvContent) {
      const newResult = parseCSVData(csvContent, updated);
      setParseResult(newResult);
    }
  };

  const handleProceedToValidation = () => {
    if (!columnMapping.date || !columnMapping.merchant || !columnMapping.amount) {
      alert('Please map Date, Merchant, and Amount fields to proceed.');
      return;
    }
    const validated = parseCSVData(csvContent, columnMapping);
    setParseResult(validated);
    setStep('validation-summary');
  };

  const handleConfirmImport = () => {
    if (!parseResult || parseResult.validTransactions.length === 0) return;

    const summary = importTransactions(fileName, parseResult.validTransactions);
    setImportSummary(summary);
    setStep('completed');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="2xl"
      title={
        step === 'file-select'
          ? 'Upload Expense CSV'
          : step === 'column-mapping'
          ? 'Map CSV Columns'
          : step === 'validation-summary'
          ? 'Review & Confirm Import'
          : 'Import Completed'
      }
      description={
        step === 'file-select'
          ? 'Choose an expense CSV. LeakLens reads it in this browser; the original file is not kept after you close this dialog.'
          : step === 'column-mapping'
          ? `File: ${fileName} — Ensure your column headers match LeakLens fields.`
          : step === 'validation-summary'
          ? `Validated ${parseResult?.totalRows || 0} rows from ${fileName}.`
          : 'Your expenses have been analysed by the leak detection engine.'
      }
    >
      {/* STEP 1: FILE SELECT */}
      {step === 'file-select' && (
        <div className="space-y-6">
          {isDemoMode && (
            <p className="rounded-md border border-[#d9e8df] bg-[#f2f8f3] p-3 text-xs leading-5 text-[#21664f]">
              Your first CSV import replaces the synthetic sample records, so example and uploaded transactions stay separate.
            </p>
          )}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer group"
          >
            <div className="rounded-full bg-white p-3 shadow-xs group-hover:scale-105 transition-transform">
              <UploadCloud className="h-8 w-8 text-emerald-600" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-slate-500">
              CSV statements from any bank, credit card, or accounting software (up to 10MB)
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
          </div>
          <p className="text-xs leading-5 text-slate-500">
            Imported transactions, findings and review notes are saved in this browser’s local storage on this device. Browser local storage is not encrypted.
          </p>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider absolute">
              or try with sample data
            </span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Pre-configured Agency Expense Statement
                </p>
                <p className="text-xs text-slate-500">
                  Includes duplicates, SaaS price bumps, unusual AWS charges, and subscriptions.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLoadSampleCSV}>
              Load Sample CSV
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: COLUMN MAPPING */}
      {step === 'column-mapping' && parseResult && (
        <div className="space-y-6">
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-900 leading-relaxed">
              We automatically matched your headers where possible. Please verify that the required
              fields (Date, Merchant, Amount) correspond to the correct CSV columns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required Fields */}
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                Transaction Date <span className="text-rose-500">*</span>
              </label>
              <select
                value={columnMapping.date}
                onChange={(e) => handleMappingChange('date', e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="">-- Select Date Column --</option>
                {parseResult.headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                Merchant / Payee <span className="text-rose-500">*</span>
              </label>
              <select
                value={columnMapping.merchant}
                onChange={(e) => handleMappingChange('merchant', e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="">-- Select Merchant Column --</option>
                {parseResult.headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                Amount <span className="text-rose-500">*</span>
              </label>
              <select
                value={columnMapping.amount}
                onChange={(e) => handleMappingChange('amount', e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="">-- Select Amount Column --</option>
                {parseResult.headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Description (Optional)</label>
              <select
                value={columnMapping.description}
                onChange={(e) => handleMappingChange('description', e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="">-- Use Merchant as Description --</option>
                {parseResult.headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Category (Optional)</label>
              <select
                value={columnMapping.category}
                onChange={(e) => handleMappingChange('category', e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="">-- Default to General --</option>
                {parseResult.headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Reference ID / Cheque (Optional)</label>
              <select
                value={columnMapping.reference_id}
                onChange={(e) => handleMappingChange('reference_id', e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-xs focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="">-- None --</option>
                {parseResult.headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sample Row Preview */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-600 mb-2">First Rows Preview</p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    {parseResult.headers.map((h) => (
                      <th key={h} className="px-3 py-2 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parseResult.previewRows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      {parseResult.headers.map((h) => (
                        <td key={h} className="px-3 py-2 text-slate-700 whitespace-nowrap">
                          {row[h] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => setStep('file-select')}>
              Back
            </Button>
            <Button onClick={handleProceedToValidation} className="gap-2">
              Validate Data <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: VALIDATION SUMMARY */}
      {step === 'validation-summary' && parseResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">Total Rows Found</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{parseResult.totalRows}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Valid Rows
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-900">
                {parseResult.validTransactions.length}
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Flagged / Rejected
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-900">{parseResult.errors.length}</p>
            </div>
          </div>

          {parseResult.errors.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4">
              <p className="text-xs font-semibold text-amber-900 mb-2">
                Rows that cannot be imported ({parseResult.errors.length})
              </p>
              <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs text-amber-800">
                {parseResult.errors.map((err, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-amber-100 py-1">
                    <span>
                      Row #{err.row}: <strong className="font-medium">{err.message}</strong>
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-white">
                      {err.field}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
            <p className="text-xs font-semibold text-slate-700 mb-2">Preview of Valid Entries</p>
            <div className="max-h-40 overflow-y-auto space-y-1 text-xs">
              {parseResult.validTransactions.slice(0, 4).map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-0">
                  <div>
                    <span className="font-medium text-slate-800">{tx.merchant}</span>
                    <span className="text-slate-400 ml-2">{tx.transaction_date}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => setStep('column-mapping')}>
              Back to Mapping
            </Button>
            <Button
              onClick={handleConfirmImport}
              disabled={parseResult.validTransactions.length === 0}
              className="gap-2"
            >
              Confirm Import ({parseResult.validTransactions.length} transactions)
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: COMPLETED */}
      {step === 'completed' && importSummary && (
        <div className="space-y-6 text-center py-4">
          <div className="inline-flex rounded-full bg-emerald-100 p-4 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">Import & Analysis Complete!</h4>
            <p className="mt-1 text-sm text-slate-600">
              Successfully imported {importSummary.importedCount} transactions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 max-w-sm mx-auto text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Imported Transactions</span>
              <span className="font-semibold text-slate-800">{importSummary.importedCount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">New Potential Leaks Flagged</span>
              <span className="font-semibold text-rose-600">{importSummary.newFindingsCount}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              onClick={() => {
                handleClose();
                onSuccess?.();
              }}
            >
              View Findings & Dashboard
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
