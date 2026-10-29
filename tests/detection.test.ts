import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectDuplicatePayments,
  detectPriceIncreases,
  detectUnusualExpenses,
  detectRecurringExpenses,
  calculateSummaryMetrics,
  runDetectionEngine,
  normalizeMerchant,
} from '../src/lib/detection/engine.ts';
import type { Transaction } from '../src/types/index.ts';

test('normalizeMerchant normalizes vendor names correctly', () => {
  assert.equal(normalizeMerchant('Adobe Systems Inc.'), 'adobe systems');
  assert.equal(normalizeMerchant('Google Cloud India Pvt Ltd'), 'google cloud');
  assert.equal(normalizeMerchant('Figma, Inc.'), 'figma');
});

test('Rule 1: Detects duplicate payments within window', () => {
  const transactions: Transaction[] = [
    {
      id: 'tx-1',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-10-12',
      merchant: 'Adobe Systems Inc.',
      description: 'Monthly Creative Cloud',
      amount: 5400,
      category: 'Software',
      created_at: '2026-10-12T00:00:00Z',
    },
    {
      id: 'tx-2',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-10-13',
      merchant: 'Adobe Systems',
      description: 'Creative Cloud All Apps',
      amount: 5400,
      category: 'Software',
      created_at: '2026-10-13T00:00:00Z',
    },
  ];

  const findings = detectDuplicatePayments(transactions);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule_type, 'duplicate_payment');
  assert.equal(findings[0].estimated_impact, 5400); // Only counts second transaction
  assert.equal(findings[0].supporting_transaction_ids.length, 2);
});

test('Rule 1: Does NOT flag legitimate repeat purchases far apart', () => {
  const transactions: Transaction[] = [
    {
      id: 'tx-1',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-09-01',
      merchant: 'Blue Tokai Coffee',
      description: 'Team meeting coffee',
      amount: 650,
      category: 'Meals',
      created_at: '2026-09-01T00:00:00Z',
    },
    {
      id: 'tx-2',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-09-22',
      merchant: 'Blue Tokai Coffee',
      description: 'Client coffee meeting',
      amount: 650,
      category: 'Meals',
      created_at: '2026-09-22T00:00:00Z',
    },
  ];

  const findings = detectDuplicatePayments(transactions);
  assert.equal(findings.length, 0); // 21 days apart, legitimate repeat
});

test('Rule 2: Identifies recurring monthly expenses and calculates annual cost', () => {
  const transactions: Transaction[] = [
    {
      id: 'tx-1',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-07-05',
      merchant: 'Google Workspace',
      description: 'Business Standard',
      amount: 1500,
      category: 'Software',
      created_at: '2026-07-05T00:00:00Z',
    },
    {
      id: 'tx-2',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-08-05',
      merchant: 'Google Workspace',
      description: 'Business Standard',
      amount: 1500,
      category: 'Software',
      created_at: '2026-08-05T00:00:00Z',
    },
    {
      id: 'tx-3',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-09-05',
      merchant: 'Google Workspace',
      description: 'Business Standard',
      amount: 1500,
      category: 'Software',
      created_at: '2026-09-05T00:00:00Z',
    },
  ];

  const recurring = detectRecurringExpenses(transactions);
  assert.equal(recurring.length, 1);
  assert.equal(recurring[0].billing_frequency, 'monthly');
  assert.equal(recurring[0].typical_amount, 1500);
  assert.equal(recurring[0].estimated_annual_cost, 18000); // 1500 * 12
});

test('Rule 3: Detects vendor price increases above threshold', () => {
  const transactions: Transaction[] = [
    {
      id: 'tx-1',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-07-10',
      merchant: 'Figma',
      description: 'Professional Seat',
      amount: 1200,
      category: 'Software',
      created_at: '2026-07-10T00:00:00Z',
    },
    {
      id: 'tx-2',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-08-10',
      merchant: 'Figma',
      description: 'Professional Seat',
      amount: 1200,
      category: 'Software',
      created_at: '2026-08-10T00:00:00Z',
    },
    {
      id: 'tx-3',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-09-10',
      merchant: 'Figma',
      description: 'Professional Seat (Upgraded)',
      amount: 1800,
      category: 'Software',
      created_at: '2026-09-10T00:00:00Z',
    },
  ];

  const findings = detectPriceIncreases(transactions);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule_type, 'price_increase');
  assert.equal(findings[0].details?.previous_amount, 1200);
  assert.equal(findings[0].details?.new_amount, 1800);
  assert.equal(findings[0].details?.percentage_increase, 50);
  assert.equal(findings[0].estimated_impact, 600);
});

test('Rule 4: Detects unusual expenses against historical baseline', () => {
  const transactions: Transaction[] = [
    {
      id: 'tx-1',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-06-01',
      merchant: 'Amazon Web Services',
      description: 'Cloud Infrastructure',
      amount: 4200,
      category: 'Infrastructure',
      created_at: '2026-06-01T00:00:00Z',
    },
    {
      id: 'tx-2',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-07-01',
      merchant: 'Amazon Web Services',
      description: 'Cloud Infrastructure',
      amount: 4150,
      category: 'Infrastructure',
      created_at: '2026-07-01T00:00:00Z',
    },
    {
      id: 'tx-3',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-08-01',
      merchant: 'Amazon Web Services',
      description: 'Cloud Infrastructure',
      amount: 4300,
      category: 'Infrastructure',
      created_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'tx-4',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-09-01',
      merchant: 'Amazon Web Services',
      description: 'Cloud Infrastructure (Spike)',
      amount: 24850,
      category: 'Infrastructure',
      created_at: '2026-09-01T00:00:00Z',
    },
  ];

  const findings = detectUnusualExpenses(transactions);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule_type, 'unusual_expense');
  assert.equal(findings[0].details?.baseline_median, 4200);
  assert.ok(findings[0].explanation.includes('higher than the typical median'));
});

test('Summary metrics calculate non-overlapping potential savings', () => {
  const transactions: Transaction[] = [
    {
      id: 'tx-1',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-10-12',
      merchant: 'Adobe',
      description: 'Sub',
      amount: 5400,
      category: 'Software',
      created_at: '2026-10-12T00:00:00Z',
    },
    {
      id: 'tx-2',
      workspace_id: 'ws-1',
      import_batch_id: 'b-1',
      transaction_date: '2026-10-13',
      merchant: 'Adobe',
      description: 'Sub',
      amount: 5400,
      category: 'Software',
      created_at: '2026-10-13T00:00:00Z',
    },
  ];

  const { findings, recurringExpenses } = runDetectionEngine(transactions);
  const metrics = calculateSummaryMetrics(transactions, findings, recurringExpenses);

  assert.equal(metrics.totalExpenses, 10800);
  assert.equal(metrics.potentialSavings, 5400); // Not 10800!
  assert.equal(metrics.issuesToReviewCount, 1);
});
