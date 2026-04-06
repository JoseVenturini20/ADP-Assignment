import { Transaction } from '../types/Transaction.types';

/**
 * Finds the employee ID of last year's top earner
 * Last year = prior calendar year (e.g. if current year is 2026, last year is 2025)
 */
export const findTopEarnerLastYear = (transactions: Transaction[]): string | null => {
  const lastYear = new Date().getFullYear() - 1;

  // Filter transactions from last year
  const lastYearTransactions = transactions.filter((t) => {
    const year = new Date(t.timeStamp).getFullYear();
    return year === lastYear;
  });

  if (lastYearTransactions.length === 0) return null;

  // Sum amounts per employee
  const earningsByEmployee = new Map<string, number>();

  for (const t of lastYearTransactions) {
    const current = earningsByEmployee.get(t.employee.id) || 0;
    earningsByEmployee.set(t.employee.id, current + t.amount);
  }

  // Find the top earner
  let topEarnerId: string | null = null;
  let topAmount = 0;

  for (const [employeeId, total] of earningsByEmployee) {
    if (total > topAmount) {
      topAmount = total;
      topEarnerId = employeeId;
    }
  }

  return topEarnerId;
};

/**
 * Gets all transaction IDs where type is "alpha" for a given employee
 */
export const getAlphaTransactionIDs = (transactions: Transaction[], employeeId: string): string[] => {
  return transactions
    .filter((t) => t.employee.id === employeeId && t.type === 'alpha')
    .map((t) => t.transactionID);
};
