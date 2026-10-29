export type DetectionRuleType =
  | 'duplicate_payment'
  | 'recurring_expense'
  | 'price_increase'
  | 'unusual_expense';

export type FindingPriority = 'high' | 'medium' | 'low';
export type EvidenceStrength = 'high' | 'medium' | 'low';

export type ReviewStatus =
  | 'new'
  | 'investigating'
  | 'legitimate'
  | 'resolved'
  | 'ignored';

export type RecurringReviewStatus =
  | 'expected'
  | 'needs_investigation'
  | 'no_longer_used'
  | 'incorrect_detection';

export interface Transaction {
  id: string;
  workspace_id: string;
  import_batch_id: string;
  transaction_date: string; // YYYY-MM-DD
  merchant: string;
  normalized_merchant?: string;
  description: string;
  amount: number;
  category: string;
  reference_id?: string;
  created_at: string;
}

export interface Finding {
  id: string;
  workspace_id: string;
  rule_type: DetectionRuleType;
  title: string;
  merchant: string;
  explanation: string;
  priority: FindingPriority;
  evidence_strength: EvidenceStrength;
  estimated_impact: number;
  review_status: ReviewStatus;
  detected_at: string;
  updated_at: string;
  supporting_transaction_ids: string[];
  user_notes?: string;
  details?: {
    // For duplicate:
    duplicate_match_reason?: string;
    // For price increase:
    previous_amount?: number;
    new_amount?: number;
    percentage_increase?: number;
    difference?: number;
    // For unusual expense:
    baseline_median?: number;
    baseline_source?: string;
    deviation_percent?: number;
    // For recurring:
    frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annual';
    typical_amount?: number;
    estimated_annual_cost?: number;
  };
}

export interface FindingNote {
  id: string;
  finding_id: string;
  user_id: string;
  user_name: string;
  note: string;
  created_at: string;
}

export interface ImportBatch {
  id: string;
  workspace_id: string;
  filename: string;
  imported_at: string;
  row_count: number;
  valid_row_count: number;
  rejected_row_count: number;
  status: 'completed' | 'failed' | 'partial';
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  currency: string;
  created_at: string;
}

export interface RecurringExpenseItem {
  id: string;
  merchant: string;
  category: string;
  billing_frequency: 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'irregular';
  typical_amount: number;
  last_observed_date: string;
  transaction_count: number;
  estimated_annual_cost: number;
  evidence_strength: EvidenceStrength;
  review_status: RecurringReviewStatus;
  transaction_ids: string[];
}

export interface DetectionConfig {
  duplicateWindowDays: number; // default 3
  priceIncreaseThresholdPercent: number; // default 15
  unusualExpenseMultiplier: number; // default 2.2x of median
  unusualExpenseMinAmount: number; // default 2000 INR
}

export interface CSVColumnMapping {
  date: string;
  merchant: string;
  description: string;
  amount: string;
  category?: string;
  reference_id?: string;
}

export interface CSVValidationRowError {
  row: number;
  field: string;
  message: string;
  raw: Record<string, string>;
}

export interface CSVParseResult {
  validTransactions: Omit<Transaction, 'id' | 'workspace_id' | 'import_batch_id' | 'created_at'>[];
  errors: CSVValidationRowError[];
  totalRows: number;
  headers: string[];
  previewRows: Record<string, string>[];
}

export interface SummaryMetrics {
  totalExpenses: number;
  potentialSavings: number;
  confirmedSavings: number;
  issuesToReviewCount: number;
  totalRecurringSpend: number;
  totalTransactionsCount: number;
}
