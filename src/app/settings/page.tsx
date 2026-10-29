'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Building,
  RotateCcw,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Layers,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useAppStore } from '@/lib/store/app-store';

export default function SettingsPage() {
  const {
    workspace,
    detectionConfig,
    updateDetectionConfig,
    updateWorkspace,
    resetToDemoData,
    clearAllData,
  } = useAppStore();

  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [duplicateDays, setDuplicateDays] = useState(detectionConfig.duplicateWindowDays);
  const [priceHikePercent, setPriceHikePercent] = useState(
    detectionConfig.priceIncreaseThresholdPercent
  );
  const [unusualMultiplier, setUnusualMultiplier] = useState(
    detectionConfig.unusualExpenseMultiplier
  );
  const [unusualMinAmount, setUnusualMinAmount] = useState(
    detectionConfig.unusualExpenseMinAmount
  );

  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace(workspaceName);
    updateDetectionConfig({
      duplicateWindowDays: Number(duplicateDays),
      priceIncreaseThresholdPercent: Number(priceHikePercent),
      unusualExpenseMultiplier: Number(unusualMultiplier),
      unusualExpenseMinAmount: Number(unusualMinAmount),
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <AppShell>
      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset to Demo Transactions"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            This will reload the initial synthetic demo agency dataset, including sample duplicates,
            price hikes, recurring SaaS, and unusual cloud hosting charges.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                resetToDemoData();
                setIsResetModalOpen(false);
              }}
            >
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear All Data Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Wipe Workspace Transactions"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to permanently clear all imported transactions, batches, and
            findings from this workspace?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                clearAllData();
                setIsClearModalOpen(false);
              }}
            >
              Wipe Everything
            </Button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Workspace Settings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Customize detection engine sensitivity, workspace profile, and audit parameters.
          </p>
        </div>

        {showSavedToast && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-2 text-xs text-emerald-900 animate-fade-in font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Settings updated successfully! All
            findings have been re-evaluated against the new thresholds.
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Workspace Details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Building className="h-4 w-4 text-emerald-600" /> Workspace Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Default Currency</label>
                <input
                  type="text"
                  disabled
                  value="INR (Indian Rupee - ₹)"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Detection Engine Sensitivity Thresholds */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-600" /> Detection Engine Parameters
            </h3>
            <p className="text-xs text-slate-500">
              Configure the exact mathematical thresholds used by the deterministic rule engine.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Duplicate Window */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block">
                  Duplicate Payment Window (Days)
                </label>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Flags identical charges to the same merchant within this window (default: 3 days).
                </p>
                <input
                  type="number"
                  min="0"
                  max="14"
                  value={duplicateDays}
                  onChange={(e) => setDuplicateDays(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Price Hike % */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block">
                  Vendor Price Increase Threshold (%)
                </label>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Minimum percentage rise over historical baseline to flag (default: 15%).
                </p>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={priceHikePercent}
                  onChange={(e) => setPriceHikePercent(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Unusual Multiplier */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block">
                  Unusual Expense Multiplier (x of Median)
                </label>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Flags charges exceeding this multiple of vendor median (default: 2.2x).
                </p>
                <input
                  type="number"
                  step="0.1"
                  min="1.5"
                  max="10"
                  value={unusualMultiplier}
                  onChange={(e) => setUnusualMultiplier(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Unusual Minimum Amount */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block">
                  Minimum Outlier Delta (₹)
                </label>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Avoid flagging small dollar variations (default: ₹2,000).
                </p>
                <input
                  type="number"
                  step="500"
                  min="500"
                  max="50000"
                  value={unusualMinAmount}
                  onChange={(e) => setUnusualMinAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" className="gap-2 text-xs">
                <Save className="h-4 w-4" /> Save Detection Configuration
              </Button>
            </div>
          </div>
        </form>

        {/* Data Reset & Danger Zone */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-600" /> Data Management & Isolation
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-800">Reset to Synthetic Demo Dataset</p>
              <p className="text-[11px] text-slate-500">
                Reload sample agency transactions demonstrating duplicate charges, price hikes, and
                spikes.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetModalOpen(true)}
              className="text-xs gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reload Demo Data
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              <p className="text-xs font-semibold text-rose-700">Wipe All Transactions</p>
              <p className="text-[11px] text-slate-500">
                Permanently clear all ledger records and reset the workspace to an empty slate.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsClearModalOpen(true)}
              className="text-xs gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Wipe Workspace Data
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
