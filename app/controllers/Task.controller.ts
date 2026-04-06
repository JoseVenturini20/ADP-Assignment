import { Request, Response } from 'express';
import { getTask, submitTask } from '../services/Api.service';
import { findTopEarnerLastYear, getAlphaTransactions } from '../helpers/Transaction.helper';

/**
 * Fetches task data from the API, processes it, and returns all
 * transactions along with the computed result for review.
 */
export const fetchTask = async (_req: Request, res: Response): Promise<void> => {
  try {
    console.log('[Task] Fetching task data...');
    const taskData = await getTask();
    const { id, transactions } = taskData;
    console.log(`[Task] Received ${transactions.length} transactions (ID: ${id})`);

    const topEarnerId = findTopEarnerLastYear(transactions);
    const topEarner = transactions.find((t) => t.employee.id === topEarnerId)?.employee;
    console.log(`[Task] Top earner: ${topEarner?.name ?? 'None'} (${topEarnerId})`);

    const alphaTransactions = topEarnerId
      ? getAlphaTransactions(transactions, topEarnerId)
      : [];
    console.log(`[Task] Found ${alphaTransactions.length} alpha transactions`);

    res.json({
      taskId: id,
      transactions: transactions.map((t) => ({
        transactionID: t.transactionID,
        amount: t.amount,
        type: t.type,
        timeStamp: t.timeStamp,
        location: t.location.name,
        employeeName: t.employee.name,
        employeeId: t.employee.id,
        categoryCode: t.employee.categoryCode,
      })),
      result: {
        topEarner: topEarnerId
          ? { id: topEarnerId, name: topEarner?.name ?? 'Unknown', categoryCode: topEarner?.categoryCode ?? 'Unknown' }
          : null,
        alphaTransactionIDs: alphaTransactions.map((t) => t.transactionID),
      },
    });
  } catch (error: unknown) {
    console.error('[Task] Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch task data' });
  }
};

/**
 * Submits the computed result to the API.
 */
export const submitResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId, alphaTransactionIDs } = req.body as {
      taskId: string;
      alphaTransactionIDs: string[];
    };

    if (!taskId || !alphaTransactionIDs) {
      res.status(400).json({ error: 'Missing taskId or alphaTransactionIDs' });
      return;
    }

    console.log(`[Task] Submitting ${alphaTransactionIDs.length} transactions for task ${taskId}...`);
    const submitResponse = await submitTask(taskId, alphaTransactionIDs);
    console.log(`[Task] Submit response: ${submitResponse.status}`);

    res.json({ status: submitResponse.status, message: 'Task submitted successfully' });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data: unknown } };
      const { status, data } = axiosError.response;

      const messages: Record<number, string> = {
        400: 'Incorrect value in result or invalid ID',
        404: 'Value not found for specified ID',
        503: 'Error communicating with database',
      };

      console.error(`[Task] Error ${status}: ${messages[status] || 'Unexpected error'}`);
      res.status(status).json({ error: messages[status] || 'Unexpected error', details: data });
      return;
    }

    console.error('[Task] Submit error:', error);
    res.status(500).json({ error: 'Failed to submit result' });
  }
};
