import type { Expense, expenseDetail, topExpense } from "$lib/utils/types";

interface Meta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}

class ExpenseStore {
  expenses: Expense[] = $state([]);
  topExpense: topExpense[] = $state([]);
  expenseDetail: expenseDetail | undefined = $state();
  totalExpense = $state(0);
  meta: Meta = $state({
    total: 0,
    limit: 10,
    offset: 0,
    page: 1,
    totalPages: 1,
  });

  isLoading = $state(false);
  error: string | null = $state(null);
  isEdit = $state(false);
  isDetail = $state(false);

  setIsDetail(status: boolean) {
    this.isDetail = status;
    if (!status) {
      this.expenseDetail = undefined;
    }
    if (status) {
      this.isEdit = false;
    }
  }

  setIsEdit(status: boolean) {
    this.isEdit = status;
    if (!status) {
      this.expenseDetail = undefined;
    }
    if (status) {
      this.isDetail = false;
    }
  }

  setData(data: {
    expenses: Expense[];
    totalExpense: number;
    meta: Meta;
  }) {
    this.expenses = data.expenses;
    this.totalExpense = data.totalExpense;
    this.meta = data.meta;
  }

  setExpenseDetail(data: expenseDetail) {
    this.expenseDetail = data;
  }

  setTopExpense(data: topExpense[]) {
    this.topExpense = data;
  }

  reset() {
    this.expenses = [];
    this.topExpense = [];
    this.totalExpense = 0;
    this.meta = {
      total: 0,
      limit: 10,
      offset: 0,
      page: 1,
      totalPages: 1,
    };
    this.error = null;
    this.isLoading = false;
    this.isEdit = false;
    this.isDetail = false;
  }
}

export const expenseStore = new ExpenseStore();
