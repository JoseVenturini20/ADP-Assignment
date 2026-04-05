export interface Location {
  name: string;
  id: string;
}

export interface Employee {
  name: string;
  id: string;
  categoryCode: string;
}

export interface Transaction {
  transactionID: string;
  timeStamp: string;
  amount: number;
  type: string;
  location: Location;
  employee: Employee;
}

export interface TaskResponse {
  id: string;
  transactions: Transaction[];
}
