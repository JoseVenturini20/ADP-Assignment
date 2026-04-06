export interface FlatTransaction {
  transactionID: string;
  amount: number;
  type: string;
  timeStamp: string;
  location: string;
  employeeName: string;
  employeeId: string;
  categoryCode: string;
}

export interface TopEarner {
  id: string;
  name: string;
  categoryCode: string;
}

export interface FetchResponse {
  taskId: string;
  transactions: FlatTransaction[];
  result: {
    topEarner: TopEarner | null;
    alphaTransactionIDs: string[];
  };
}

export interface SubmitResponse {
  status: number;
  message: string;
  error?: string;
  details?: string;
}
