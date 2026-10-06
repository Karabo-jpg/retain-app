import { axiosClient } from "./axiosClient";
import type { ExpenseFormValues, ExpenseListParams, PaginatedResponse } from "../types/api";
import type { Expense } from "../types/models";

export async function fetchExpenses(params: ExpenseListParams): Promise<PaginatedResponse<Expense>> {
  const { data } = await axiosClient.get<PaginatedResponse<Expense>>("/expenses", { params });
  return data;
}

export async function createExpense(payload: ExpenseFormValues): Promise<Expense> {
  const { data } = await axiosClient.post<Expense>("/expenses", payload);
  return data;
}

export async function updateExpense(id: string, payload: ExpenseFormValues): Promise<Expense> {
  const { data } = await axiosClient.put<Expense>(`/expenses/${id}`, payload);
  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  await axiosClient.delete(`/expenses/${id}`);
}
