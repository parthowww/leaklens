import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCSVData, parseAmount, parseDate, autoDetectColumnMapping } from '../src/lib/csv/parser.ts';

test('parseAmount parses different currency formats and strips symbols', () => {
  assert.equal(parseAmount('1200').value, 1200);
  assert.equal(parseAmount('₹ 1,500.50').value, 1500.5);
  assert.equal(parseAmount('$2,499.00').value, 2499);
  assert.equal(parseAmount('(500.00)').value, 500);
  assert.equal(parseAmount('-450').value, 450);
  assert.ok(parseAmount('invalid').error);
});

test('parseDate handles YYYY-MM-DD, DD/MM/YYYY and standard dates', () => {
  assert.equal(parseDate('2026-10-15').date, '2026-10-15');
  assert.equal(parseDate('15/10/2026').date, '2026-10-15');
  assert.equal(parseDate('2026/08/04').date, '2026-08-04');
  assert.ok(parseDate('not-a-date').error);
});

test('autoDetectColumnMapping maps common business headers', () => {
  const headers = ['Txn Date', 'Vendor Name', 'Narration', 'Debit Amount', 'Expense Category', 'Ref No'];
  const mapping = autoDetectColumnMapping(headers);

  assert.equal(mapping.date, 'Txn Date');
  assert.equal(mapping.merchant, 'Vendor Name');
  assert.equal(mapping.amount, 'Debit Amount');
  assert.equal(mapping.category, 'Expense Category');
  assert.equal(mapping.reference_id, 'Ref No');
});

test('parseCSVData parses CSV correctly with valid transactions and captures errors', () => {
  const csv = `Date,Vendor,Description,Amount,Category
2026-10-01,Google Cloud,Server hosting,4200,Infrastructure
2026-10-02,Adobe Systems,Creative Cloud,5400,Software
invalid-date,Slack,Chat software,1200,Software
2026-10-04,WeWork,Office Desk,not-a-number,Office
`;

  const result = parseCSVData(csv);
  assert.equal(result.totalRows, 4);
  assert.equal(result.validTransactions.length, 2);
  assert.equal(result.errors.length, 2);
  assert.equal(result.validTransactions[0].merchant, 'Google Cloud');
  assert.equal(result.validTransactions[0].amount, 4200);
});
