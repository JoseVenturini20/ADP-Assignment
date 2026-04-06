import { findTopEarnerLastYear, getAlphaTransactions } from '../src/helpers/Transaction.helper';
import { Transaction } from '../src/types/Transaction.types';

const lastYear = new Date().getFullYear() - 1;
const currentYear = new Date().getFullYear();

const makeTransaction = (
  overrides: Partial<Transaction> & { employeeId?: string; employeeName?: string; year?: number },
): Transaction => ({
  transactionID: overrides.transactionID ?? 'TX_000',
  timeStamp: overrides.timeStamp ?? `${overrides.year ?? lastYear}-06-15T00:00:00.000Z`,
  amount: overrides.amount ?? 1000,
  type: overrides.type ?? 'alpha',
  location: overrides.location ?? { name: 'Test City', id: 'L001' },
  employee: overrides.employee ?? {
    name: overrides.employeeName ?? 'John Doe',
    id: overrides.employeeId ?? 'EMP001',
    categoryCode: 'blue',
  },
});

describe('findTopEarnerLastYear', () => {
  it('should return null when there are no transactions', () => {
    expect(findTopEarnerLastYear([])).toBeNull();
  });

  it('should return null when no transactions are from last year', () => {
    const transactions = [
      makeTransaction({ year: currentYear, employeeId: 'EMP001' }),
      makeTransaction({ year: currentYear - 2, employeeId: 'EMP002' }),
    ];
    expect(findTopEarnerLastYear(transactions)).toBeNull();
  });

  it('should return the top earner from last year', () => {
    const transactions = [
      makeTransaction({ transactionID: 'TX_001', employeeId: 'EMP001', amount: 5000 }),
      makeTransaction({ transactionID: 'TX_002', employeeId: 'EMP001', amount: 3000 }),
      makeTransaction({ transactionID: 'TX_003', employeeId: 'EMP002', amount: 7000 }),
    ];
    // EMP001: 8000, EMP002: 7000
    expect(findTopEarnerLastYear(transactions)).toBe('EMP001');
  });

  it('should only consider last year transactions when calculating totals', () => {
    const transactions = [
      makeTransaction({ transactionID: 'TX_001', employeeId: 'EMP001', amount: 1000, year: lastYear }),
      makeTransaction({ transactionID: 'TX_002', employeeId: 'EMP002', amount: 500, year: lastYear }),
      // High amount but current year — should be ignored
      makeTransaction({ transactionID: 'TX_003', employeeId: 'EMP002', amount: 99999, year: currentYear }),
    ];
    expect(findTopEarnerLastYear(transactions)).toBe('EMP001');
  });

  it('should handle a single transaction', () => {
    const transactions = [
      makeTransaction({ transactionID: 'TX_001', employeeId: 'EMP001', amount: 100 }),
    ];
    expect(findTopEarnerLastYear(transactions)).toBe('EMP001');
  });

  it('should sum multiple transactions per employee correctly', () => {
    const transactions = [
      makeTransaction({ transactionID: 'TX_001', employeeId: 'EMP001', amount: 100 }),
      makeTransaction({ transactionID: 'TX_002', employeeId: 'EMP001', amount: 200 }),
      makeTransaction({ transactionID: 'TX_003', employeeId: 'EMP001', amount: 300 }),
      makeTransaction({ transactionID: 'TX_004', employeeId: 'EMP002', amount: 599 }),
    ];
    // EMP001: 600, EMP002: 599
    expect(findTopEarnerLastYear(transactions)).toBe('EMP001');
  });
});

describe('getAlphaTransactions', () => {
  it('should return empty array when there are no transactions', () => {
    expect(getAlphaTransactions([], 'EMP001')).toEqual([]);
  });

  it('should return only alpha transactions for the given employee from last year', () => {
    const transactions = [
      makeTransaction({ transactionID: 'TX_001', employeeId: 'EMP001', type: 'alpha' }),
      makeTransaction({ transactionID: 'TX_002', employeeId: 'EMP001', type: 'beta' }),
      makeTransaction({ transactionID: 'TX_003', employeeId: 'EMP001', type: 'alpha' }),
      makeTransaction({ transactionID: 'TX_004', employeeId: 'EMP002', type: 'alpha' }),
    ];

    const result = getAlphaTransactions(transactions, 'EMP001');
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.transactionID)).toEqual(['TX_001', 'TX_003']);
  });

  it('should exclude transactions from other years', () => {
    const transactions = [
      makeTransaction({ transactionID: 'TX_001', employeeId: 'EMP001', type: 'alpha', year: lastYear }),
      makeTransaction({ transactionID: 'TX_002', employeeId: 'EMP001', type: 'alpha', year: currentYear }),
      makeTransaction({ transactionID: 'TX_003', employeeId: 'EMP001', type: 'alpha', year: lastYear - 1 }),
    ];

    const result = getAlphaTransactions(transactions, 'EMP001');
    expect(result).toHaveLength(1);
    expect(result[0].transactionID).toBe('TX_001');
  });

  it('should return empty array when employee has no alpha transactions', () => {
    const transactions = [
      makeTransaction({ transactionID: 'TX_001', employeeId: 'EMP001', type: 'beta' }),
      makeTransaction({ transactionID: 'TX_002', employeeId: 'EMP001', type: 'gamma' }),
    ];

    expect(getAlphaTransactions(transactions, 'EMP001')).toEqual([]);
  });

  it('should return empty array when employee does not exist', () => {
    const transactions = [
      makeTransaction({ transactionID: 'TX_001', employeeId: 'EMP001', type: 'alpha' }),
    ];

    expect(getAlphaTransactions(transactions, 'NONEXISTENT')).toEqual([]);
  });
});
