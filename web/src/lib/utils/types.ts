export type Expense = {
  id: string;
  name: string;
  amount: number;
  category: string;
  spentAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseSummary = {
  totalExpenses: string;
  expenses: Expense[];
};

export type expenseDetail = {
  id: string;
  name: string;
  amount: number;
  category_name: string;
  spent_at: string;
  updated_at: string;
};

export interface topExpense {
  name?: string;
  total?: number;
  amount?: number;
}

export interface AlertNotification {
    userId: number;
    id: string;
    currentSpending: number;
    maxSpending: number;
    alertPercentage: number;
    currentPercentage: number;
    message: string;
    isAlert: boolean;
    timestamp: string;
}

export interface ErrorMessage {
    message: string;
    details?: string;
}

export interface spendingLimit {
  period: string;
  amount: number;
  alertPercentage: number;
}