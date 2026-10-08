import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as expenseApi from "../../api/expenseApi";
import type { ExpenseFormValues, ExpenseListParams } from "../../types/api";
import type { Expense, PaymentMethod } from "../../types/models";

export interface ExpenseFilters {
  category?: string;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

interface ExpensesState {
  items: Expense[];
  total: number;
  page: number;
  pageSize: number;
  filters: ExpenseFilters;
  sortBy: ExpenseListParams["sortBy"];
  sortDir: ExpenseListParams["sortDir"];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ExpensesState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 10,
  filters: {},
  sortBy: "date",
  sortDir: "desc",
  status: "idle",
  error: null,
};

function buildParams(state: ExpensesState): ExpenseListParams {
  return {
    ...state.filters,
    sortBy: state.sortBy,
    sortDir: state.sortDir,
    page: state.page,
    pageSize: state.pageSize,
  };
}

export const fetchExpenses = createAsyncThunk("expenses/fetchAll", async (_: void, { getState }) => {
  const state = (getState() as { expenses: ExpensesState }).expenses;
  return expenseApi.fetchExpenses(buildParams(state));
});

export const createExpenseThunk = createAsyncThunk(
  "expenses/create",
  async (payload: ExpenseFormValues, { dispatch }) => {
    const result = await expenseApi.createExpense(payload);
    await dispatch(fetchExpenses());
    return result;
  },
);

export const updateExpenseThunk = createAsyncThunk(
  "expenses/update",
  async ({ id, payload }: { id: string; payload: ExpenseFormValues }, { dispatch }) => {
    const result = await expenseApi.updateExpense(id, payload);
    await dispatch(fetchExpenses());
    return result;
  },
);

export const deleteExpenseThunk = createAsyncThunk(
  "expenses/delete",
  async (id: string, { dispatch }) => {
    await expenseApi.deleteExpense(id);
    await dispatch(fetchExpenses());
  },
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<ExpenseFilters>) {
      state.filters = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<{ sortBy: ExpensesState["sortBy"]; sortDir: ExpensesState["sortDir"] }>) {
      state.sortBy = action.payload.sortBy;
      state.sortDir = action.payload.sortDir;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load expenses";
      });
  },
});

export const { setFilters, setSort, setPage, setPageSize } = expensesSlice.actions;
export default expensesSlice.reducer;
