import type {
  Transaction,
  Finding,
  DetectionConfig,
  RecurringExpenseItem,
  SummaryMetrics,
} from '@/types';

export const DEFAULT_DETECTION_CONFIG: DetectionConfig = {
  duplicateWindowDays: 3,
  priceIncreaseThresholdPercent: 15,
  unusualExpenseMultiplier: 2.2,
  unusualExpenseMinAmount: 2000,
};

// Normalize merchant name for robust matching
export function normalizeMerchant(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .replace(/\b(pvt|ltd|inc|llc|co|corp|technologies|solutions|india|limited|gmbh)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Parse date string into UTC epoch ms
function parseDateMs(dateStr: string): number {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return Date.UTC(y, m, d);
  }
  return new Date(dateStr).getTime();
}

function daysBetween(date1: string, date2: string): number {
  const ms1 = parseDateMs(date1);
  const ms2 = parseDateMs(date2);
  return Math.abs(Math.round((ms1 - ms2) / (1000 * 60 * 60 * 24)));
}

// Calculate median
function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[half];
  }
  return (sorted[half - 1] + sorted[half]) / 2.0;
}

/**
 * Detection Rule 1: Possible Duplicate Payments
 */
export function detectDuplicatePayments(
  transactions: Transaction[],
  config: DetectionConfig = DEFAULT_DETECTION_CONFIG
): Finding[] {
  const findings: Finding[] = [];
  const processedPairs = new Set<string>();

  // Sort by date ascending
  const sorted = [...transactions].sort(
    (a, b) => parseDateMs(a.transaction_date) - parseDateMs(b.transaction_date)
  );

  for (let i = 0; i < sorted.length; i++) {
    const t1 = sorted[i];
    const m1 = normalizeMerchant(t1.merchant);

    for (let j = i + 1; j < sorted.length; j++) {
      const t2 = sorted[j];
      const m2 = normalizeMerchant(t2.merchant);

      const daysDiff = daysBetween(t1.transaction_date, t2.transaction_date);
      // If outside window, and transactions are sorted by date, we can skip if dates diverge too far
      if (daysDiff > config.duplicateWindowDays) {
        continue;
      }

      // Check merchant match
      const merchantMatches = m1 === m2 || m1.includes(m2) || m2.includes(m1);
      if (!merchantMatches) continue;

      // Check amount match (exact or within 0.5% tolerance)
      const amountDiff = Math.abs(t1.amount - t2.amount);
      const isSameAmount = amountDiff === 0 || amountDiff / Math.max(t1.amount, t2.amount) < 0.005;

      if (isSameAmount && t1.amount > 0) {
        // Exclude if explicitly marked with distinct valid reference IDs that indicate recurring or separate invoices
        const pairKey = [t1.id, t2.id].sort().join(':::');
        if (processedPairs.has(pairKey)) continue;
        processedPairs.add(pairKey);

        const isExactSameDay = daysDiff === 0;
        const priority = t1.amount > 10000 ? 'high' : t1.amount > 3000 ? 'medium' : 'low';

        findings.push({
          id: `dup-${t1.id}-${t2.id}`,
          workspace_id: t1.workspace_id,
          rule_type: 'duplicate_payment',
          title: `Potential duplicate payment to ${t2.merchant}`,
          merchant: t2.merchant,
          explanation: `Two identical charges of ₹${t1.amount.toLocaleString(
            'en-IN'
          )} occurred within ${
            isExactSameDay ? 'the same day' : `${daysDiff} day(s)`
          } (${t1.transaction_date} and ${t2.transaction_date}).`,
          priority,
          evidence_strength: isExactSameDay ? 'high' : 'medium',
          estimated_impact: t1.amount, // ONLY count the extra transaction once
          review_status: 'new',
          detected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          supporting_transaction_ids: [t1.id, t2.id],
          details: {
            duplicate_match_reason: isExactSameDay
              ? 'Identical amount and identical transaction date.'
              : `Identical amount within ${daysDiff} day window.`,
          },
        });
      }
    }
  }

  return findings;
}

/**
 * Detection Rule 2: Recurring Expenses
 */
export function detectRecurringExpenses(
  transactions: Transaction[]
): RecurringExpenseItem[] {
  const recurringItems: RecurringExpenseItem[] = [];

  // Group by normalized merchant
  const grouped = new Map<string, Transaction[]>();
  for (const t of transactions) {
    if (t.amount <= 0) continue;
    const norm = normalizeMerchant(t.merchant) || t.merchant.toLowerCase().trim();
    const existing = grouped.get(norm) || [];
    existing.push(t);
    grouped.set(norm, existing);
  }

  grouped.forEach((txList) => {
    // Need at least 2 transactions to observe recurrence
    if (txList.length < 2) return;

    // Sort by date ascending
    txList.sort(
      (a, b) => parseDateMs(a.transaction_date) - parseDateMs(b.transaction_date)
    );

    const intervals: number[] = [];
    for (let i = 1; i < txList.length; i++) {
      intervals.push(daysBetween(txList[i - 1].transaction_date, txList[i].transaction_date));
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const amounts = txList.map((t) => t.amount);
    const medianAmount = calculateMedian(amounts);

    // Check consistency of amounts (within 20% of median)
    const consistentAmounts = amounts.every(
      (a) => Math.abs(a - medianAmount) / medianAmount <= 0.25
    );

    if (!consistentAmounts && txList.length < 3) return;

    let frequency: 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'irregular' = 'irregular';
    let annualMultiplier = 0;

    if (avgInterval >= 5 && avgInterval <= 9) {
      frequency = 'weekly';
      annualMultiplier = 52;
    } else if (avgInterval >= 25 && avgInterval <= 35) {
      frequency = 'monthly';
      annualMultiplier = 12;
    } else if (avgInterval >= 80 && avgInterval <= 100) {
      frequency = 'quarterly';
      annualMultiplier = 4;
    } else if (avgInterval >= 340 && avgInterval <= 380) {
      frequency = 'annual';
      annualMultiplier = 1;
    } else if (txList.length >= 3 && avgInterval > 0) {
      // Approximate recurrence
      annualMultiplier = Math.round(365 / avgInterval);
      frequency = 'irregular';
    }

    if (annualMultiplier > 0) {
      const estimatedAnnualCost = Math.round(medianAmount * annualMultiplier);
      const lastTx = txList[txList.length - 1];

      recurringItems.push({
        id: `rec-${lastTx.id}`,
        merchant: lastTx.merchant,
        category: lastTx.category || 'Software & Subscriptions',
        billing_frequency: frequency,
        typical_amount: medianAmount,
        last_observed_date: lastTx.transaction_date,
        transaction_count: txList.length,
        estimated_annual_cost: estimatedAnnualCost,
        evidence_strength: txList.length >= 3 ? 'high' : 'medium',
        review_status: 'expected',
        transaction_ids: txList.map((t) => t.id),
      });
    }
  });

  return recurringItems.sort((a, b) => b.estimated_annual_cost - a.estimated_annual_cost);
}

/**
 * Detection Rule 3: Vendor Price Increases
 */
export function detectPriceIncreases(
  transactions: Transaction[],
  config: DetectionConfig = DEFAULT_DETECTION_CONFIG
): Finding[] {
  const findings: Finding[] = [];

  // Group by normalized merchant
  const grouped = new Map<string, Transaction[]>();
  for (const t of transactions) {
    if (t.amount <= 0) continue;
    const norm = normalizeMerchant(t.merchant) || t.merchant.toLowerCase().trim();
    const existing = grouped.get(norm) || [];
    existing.push(t);
    grouped.set(norm, existing);
  }

  grouped.forEach((txList) => {
    // Need at least 2 transactions over time to detect price hike
    if (txList.length < 2) return;

    // Sort chronologically
    txList.sort(
      (a, b) => parseDateMs(a.transaction_date) - parseDateMs(b.transaction_date)
    );

    const latestTx = txList[txList.length - 1];
    // Previous baseline: transactions prior to the latest one
    const previousTxs = txList.slice(0, txList.length - 1);
    const previousAmounts = previousTxs.map((t) => t.amount);
    const previousTypicalAmount = calculateMedian(previousAmounts);

    if (previousTypicalAmount <= 0) return;

    const diff = latestTx.amount - previousTypicalAmount;
    const percentIncrease = Math.round((diff / previousTypicalAmount) * 100);

    // Check if price increase exceeds threshold (default 15%) and is at least ₹200
    if (percentIncrease >= config.priceIncreaseThresholdPercent && diff >= 200) {
      // Annualized impact if recurring monthly (difference * 12) or lump sum
      const annualizedImpact = diff * 12;
      const priority =
        annualizedImpact > 20000 || percentIncrease >= 50
          ? 'high'
          : percentIncrease >= 25
          ? 'medium'
          : 'low';

      findings.push({
        id: `price-inc-${latestTx.id}`,
        workspace_id: latestTx.workspace_id,
        rule_type: 'price_increase',
        title: `Price increase detected for ${latestTx.merchant}`,
        merchant: latestTx.merchant,
        explanation: `${latestTx.merchant} increased by ${percentIncrease}% from ₹${previousTypicalAmount.toLocaleString(
          'en-IN'
        )} to ₹${latestTx.amount.toLocaleString('en-IN')} on ${latestTx.transaction_date}.`,
        priority,
        evidence_strength: previousTxs.length >= 2 ? 'high' : 'medium',
        estimated_impact: diff, // Monthly immediate delta
        review_status: 'new',
        detected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        supporting_transaction_ids: [latestTx.id, previousTxs[previousTxs.length - 1].id],
        details: {
          previous_amount: previousTypicalAmount,
          new_amount: latestTx.amount,
          percentage_increase: percentIncrease,
          difference: diff,
          frequency: 'monthly',
        },
      });
    }
  });

  return findings;
}

/**
 * Detection Rule 4: Unusual Expenses
 */
export function detectUnusualExpenses(
  transactions: Transaction[],
  config: DetectionConfig = DEFAULT_DETECTION_CONFIG
): Finding[] {
  const findings: Finding[] = [];

  // Group by normalized merchant
  const groupedByMerchant = new Map<string, Transaction[]>();
  for (const t of transactions) {
    if (t.amount <= 0) continue;
    const norm = normalizeMerchant(t.merchant) || t.merchant.toLowerCase().trim();
    const existing = groupedByMerchant.get(norm) || [];
    existing.push(t);
    groupedByMerchant.set(norm, existing);
  }

  // Also calculate category baseline medians
  const groupedByCategory = new Map<string, number[]>();
  for (const t of transactions) {
    if (t.amount <= 0) continue;
    const cat = t.category || 'General';
    const list = groupedByCategory.get(cat) || [];
    list.push(t.amount);
    groupedByCategory.set(cat, list);
  }

  // Track already flagged transaction IDs to avoid overlapping noise
  const flaggedIds = new Set<string>();

  // Check each transaction
  for (const t of transactions) {
    if (t.amount <= 0 || flaggedIds.has(t.id)) continue;

    const norm = normalizeMerchant(t.merchant) || t.merchant.toLowerCase().trim();
    const merchantTxs = groupedByMerchant.get(norm) || [];

    // Case A: Vendor has historical charges (at least 3 charges)
    if (merchantTxs.length >= 3) {
      const otherCharges = merchantTxs.filter((tx) => tx.id !== t.id).map((tx) => tx.amount);
      const merchantMedian = calculateMedian(otherCharges);

      if (merchantMedian > 0) {
        const threshold = merchantMedian * config.unusualExpenseMultiplier;
        const diff = t.amount - merchantMedian;

        if (t.amount >= threshold && diff >= config.unusualExpenseMinAmount) {
          const deviationPercent = Math.round(((t.amount - merchantMedian) / merchantMedian) * 100);
          const priority = t.amount > 25000 || deviationPercent > 300 ? 'high' : 'medium';

          findings.push({
            id: `unusual-${t.id}`,
            workspace_id: t.workspace_id,
            rule_type: 'unusual_expense',
            title: `Unusually high expense from ${t.merchant}`,
            merchant: t.merchant,
            explanation: `Charge of ₹${t.amount.toLocaleString(
              'en-IN'
            )} is ${deviationPercent}% higher than the typical median expense of ₹${merchantMedian.toLocaleString(
              'en-IN'
            )} for this vendor (based on ${otherCharges.length} prior transactions).`,
            priority,
            evidence_strength: 'high',
            estimated_impact: diff, // Excess above normal median
            review_status: 'new',
            detected_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            supporting_transaction_ids: [t.id],
            details: {
              baseline_median: merchantMedian,
              baseline_source: `${t.merchant} historical median (${otherCharges.length} transactions)`,
              deviation_percent: deviationPercent,
              difference: diff,
            },
          });

          flaggedIds.add(t.id);
          continue;
        }
      }
    }

    // Case B: Global/Category outlier (single isolated massive charge > 3.5x category median)
    const cat = t.category || 'General';
    const catAmounts = groupedByCategory.get(cat) || [];
    if (catAmounts.length >= 5) {
      const catMedian = calculateMedian(catAmounts);
      const catThreshold = catMedian * 3.5;
      const catDiff = t.amount - catMedian;

      if (t.amount >= catThreshold && catDiff >= 15000) {
        const deviationPercent = Math.round(((t.amount - catMedian) / catMedian) * 100);

        findings.push({
          id: `unusual-cat-${t.id}`,
          workspace_id: t.workspace_id,
          rule_type: 'unusual_expense',
          title: `Outlier charge in ${cat}: ${t.merchant}`,
          merchant: t.merchant,
          explanation: `Charge of ₹${t.amount.toLocaleString(
            'en-IN'
          )} is ${deviationPercent}% above the typical median of ₹${catMedian.toLocaleString(
            'en-IN'
          )} for category "${cat}".`,
          priority: 'medium',
          evidence_strength: 'medium',
          estimated_impact: catDiff,
          review_status: 'new',
          detected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          supporting_transaction_ids: [t.id],
          details: {
            baseline_median: catMedian,
            baseline_source: `Category "${cat}" median baseline`,
            deviation_percent: deviationPercent,
            difference: catDiff,
          },
        });

        flaggedIds.add(t.id);
      }
    }
  }

  return findings;
}

/**
 * Unified Detection Engine Runner
 */
export function runDetectionEngine(
  transactions: Transaction[],
  existingFindings: Finding[] = [],
  config: DetectionConfig = DEFAULT_DETECTION_CONFIG
): {
  findings: Finding[];
  recurringExpenses: RecurringExpenseItem[];
} {
  const duplicates = detectDuplicatePayments(transactions, config);
  const priceIncreases = detectPriceIncreases(transactions, config);
  const unusualExpenses = detectUnusualExpenses(transactions, config);
  const recurringExpenses = detectRecurringExpenses(transactions);

  const newDetectedFindings = [...duplicates, ...priceIncreases, ...unusualExpenses];

  // Preserve user status/notes from existing findings if same finding ID exists
  const existingMap = new Map<string, Finding>();
  existingFindings.forEach((f) => existingMap.set(f.id, f));

  const mergedFindings: Finding[] = newDetectedFindings.map((finding) => {
    const prev = existingMap.get(finding.id);
    if (prev) {
      return {
        ...finding,
        review_status: prev.review_status,
        user_notes: prev.user_notes,
      };
    }
    return finding;
  });

  return {
    findings: mergedFindings,
    recurringExpenses,
  };
}

/**
 * Financial Impact & Summary Metrics Calculation
 * Transparent, non-overlapping aggregation
 */
export function calculateSummaryMetrics(
  transactions: Transaction[],
  findings: Finding[],
  recurringExpenses: RecurringExpenseItem[]
): SummaryMetrics {
  const totalExpenses = transactions.reduce((acc, t) => acc + (t.amount > 0 ? t.amount : 0), 0);

  // Potential savings: sum of unresolved findings, preventing double counting
  // Only count findings that are 'new' or 'investigating'
  const activeFindings = findings.filter(
    (f) => f.review_status === 'new' || f.review_status === 'investigating'
  );

  const resolvedFindings = findings.filter((f) => f.review_status === 'resolved');

  // Prevent overlap: track transactions included in savings
  const countedTxSet = new Set<string>();
  let potentialSavings = 0;

  for (const f of activeFindings) {
    // If it's a duplicate payment, impact is the second transaction amount
    if (f.rule_type === 'duplicate_payment') {
      const secondTxId = f.supporting_transaction_ids[1] || f.supporting_transaction_ids[0];
      if (!countedTxSet.has(secondTxId)) {
        countedTxSet.add(secondTxId);
        potentialSavings += f.estimated_impact;
      }
    } else if (f.rule_type === 'price_increase') {
      // Annualised price increase or monthly delta
      potentialSavings += f.estimated_impact;
    } else if (f.rule_type === 'unusual_expense') {
      const txId = f.supporting_transaction_ids[0];
      if (!countedTxSet.has(txId)) {
        countedTxSet.add(txId);
        potentialSavings += f.estimated_impact;
      }
    }
  }

  // Confirmed savings: resolved findings
  let confirmedSavings = 0;
  for (const f of resolvedFindings) {
    confirmedSavings += f.estimated_impact;
  }

  const issuesToReviewCount = activeFindings.length;

  const totalRecurringSpend = recurringExpenses.reduce(
    (acc, item) => acc + item.estimated_annual_cost,
    0
  );

  return {
    totalExpenses,
    potentialSavings: Math.round(potentialSavings),
    confirmedSavings: Math.round(confirmedSavings),
    issuesToReviewCount,
    totalRecurringSpend: Math.round(totalRecurringSpend),
    totalTransactionsCount: transactions.length,
  };
}
