import Papa from 'papaparse';
import type {
  CSVColumnMapping,
  CSVParseResult,
  CSVValidationRowError,
  Transaction,
} from '@/types';

// Common header synonyms for automatic column mapping
const HEADER_SYNONYMS: Record<keyof CSVColumnMapping, string[]> = {
  date: [
    'date',
    'transaction date',
    'transaction_date',
    'txndate',
    'txn date',
    'payment date',
    'booking date',
    'value date',
    'posted date',
  ],
  merchant: [
    'merchant',
    'vendor',
    'payee',
    'recipient',
    'party',
    'beneficiary',
    'store',
    'supplier',
    'biller',
    'merchant name',
  ],
  description: [
    'description',
    'details',
    'narration',
    'particulars',
    'memo',
    'notes',
    'remarks',
    'transaction remarks',
    'summary',
  ],
  amount: [
    'amount',
    'debit',
    'expense',
    'spent',
    'charge',
    'total',
    'cost',
    'value',
    'txn amount',
    'transaction amount',
  ],
  category: [
    'category',
    'expense category',
    'tag',
    'type',
    'expense type',
    'classification',
    'group',
    'department',
  ],
  reference_id: [
    'reference',
    'ref',
    'reference id',
    'reference no',
    'ref no',
    'txn id',
    'transaction id',
    'cheque no',
    'invoice',
    'invoice no',
    'id',
  ],
};

export function autoDetectColumnMapping(headers: string[]): CSVColumnMapping {
  const normalizedHeaders = headers.map((h) => ({
    original: h,
    cleaned: h.toLowerCase().trim().replace(/[^a-z0-9]/g, ' '),
  }));

  const mapping: Partial<CSVColumnMapping> = {};

  const findMatch = (key: keyof CSVColumnMapping): string => {
    const synonyms = HEADER_SYNONYMS[key];
    for (const syn of synonyms) {
      const match = normalizedHeaders.find((h) => {
        return (
          h.cleaned === syn ||
          h.cleaned.startsWith(syn + ' ') ||
          h.cleaned.endsWith(' ' + syn) ||
          h.cleaned.includes(syn)
        );
      });
      if (match) return match.original;
    }
    return '';
  };

  mapping.date = findMatch('date');
  mapping.merchant = findMatch('merchant');
  mapping.description = findMatch('description') || mapping.merchant;
  mapping.amount = findMatch('amount');
  mapping.category = findMatch('category');
  mapping.reference_id = findMatch('reference_id');

  // Fallback for merchant if only description found or vice versa
  if (!mapping.merchant && mapping.description) {
    mapping.merchant = mapping.description;
  }

  return {
    date: mapping.date || headers[0] || '',
    merchant: mapping.merchant || headers[1] || '',
    description: mapping.description || mapping.merchant || headers[1] || '',
    amount: mapping.amount || headers[2] || '',
    category: mapping.category || '',
    reference_id: mapping.reference_id || '',
  };
}

export function parseAmount(raw: unknown): { value: number; error?: string } {
  if (raw === undefined || raw === null || raw === '') {
    return { value: 0, error: 'Amount is required' };
  }

  let str = String(raw).trim();
  // Check for parenthesis negative e.g. (1200.50)
  const isParenNegative = /^\(.*\)$/.test(str);
  str = str.replace(/[(),₹$€£\s]/g, '');

  const num = parseFloat(str);
  if (isNaN(num)) {
    return { value: 0, error: `Invalid amount "${raw}"` };
  }

  let finalVal = isParenNegative ? -Math.abs(num) : num;
  // If raw was a debit represented as negative, normalize to positive expense
  finalVal = Math.abs(finalVal);

  return { value: finalVal };
}

export function parseDate(raw: unknown): { date: string; error?: string } {
  if (!raw || typeof raw !== 'string') {
    return { date: '', error: 'Date is required' };
  }

  const str = raw.trim();

  // 1. ISO format: YYYY-MM-DD
  const isoMatch = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(str);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = String(parseInt(isoMatch[2], 10)).padStart(2, '0');
    const d = String(parseInt(isoMatch[3], 10)).padStart(2, '0');
    return { date: `${y}-${m}-${d}` };
  }

  // 2. DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(str);
  if (dmyMatch) {
    const p1 = parseInt(dmyMatch[1], 10);
    const p2 = parseInt(dmyMatch[2], 10);
    const y = parseInt(dmyMatch[3], 10);

    // If p1 > 12, it must be DD-MM-YYYY
    let d = p1;
    let m = p2;
    if (p1 <= 12 && p2 > 12) {
      // MM-DD-YYYY
      m = p1;
      d = p2;
    }

    const mStr = String(m).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    return { date: `${y}-${mStr}-${dStr}` };
  }

  // 3. Fallback standard Date.parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return { date: `${y}-${m}-${d}` };
  }

  return { date: '', error: `Invalid date format "${raw}"` };
}

export function parseCSVData(
  csvContent: string,
  userMapping?: Partial<CSVColumnMapping>
): CSVParseResult {
  const parsed = Papa.parse<Record<string, string>>(csvContent.trim(), {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  });

  const headers = parsed.meta.fields || [];
  const mapping: CSVColumnMapping = {
    ...autoDetectColumnMapping(headers),
    ...(userMapping || {}),
  };

  const validTransactions: Omit<Transaction, 'id' | 'workspace_id' | 'import_batch_id' | 'created_at'>[] = [];
  const errors: CSVValidationRowError[] = [];

  parsed.data.forEach((row, index) => {
    const rowNumber = index + 2; // 1-indexed, accounting for header row

    const rawDate = row[mapping.date];
    const rawMerchant = row[mapping.merchant];
    const rawDesc = row[mapping.description];
    const rawAmount = row[mapping.amount];
    const rawCategory = mapping.category ? row[mapping.category] : undefined;
    const rawRef = mapping.reference_id ? row[mapping.reference_id] : undefined;

    // Check empty row
    if (!rawDate && !rawMerchant && !rawAmount) {
      return; // Skip blank row
    }

    let hasRowError = false;

    // Validate merchant
    const merchant = (rawMerchant || rawDesc || '').trim();
    if (!merchant) {
      errors.push({
        row: rowNumber,
        field: 'merchant',
        message: 'Missing merchant or payee name',
        raw: row,
      });
      hasRowError = true;
    }

    // Validate date
    const dateResult = parseDate(rawDate);
    if (dateResult.error) {
      errors.push({
        row: rowNumber,
        field: 'date',
        message: dateResult.error,
        raw: row,
      });
      hasRowError = true;
    }

    // Validate amount
    const amountResult = parseAmount(rawAmount);
    if (amountResult.error) {
      errors.push({
        row: rowNumber,
        field: 'amount',
        message: amountResult.error,
        raw: row,
      });
      hasRowError = true;
    }

    if (!hasRowError && amountResult.value > 0) {
      validTransactions.push({
        transaction_date: dateResult.date,
        merchant,
        description: (rawDesc || merchant).trim(),
        amount: amountResult.value,
        category: (rawCategory || 'General').trim(),
        reference_id: rawRef ? String(rawRef).trim() : undefined,
      });
    }
  });

  return {
    validTransactions,
    errors,
    totalRows: parsed.data.length,
    headers,
    previewRows: parsed.data.slice(0, 5),
  };
}
