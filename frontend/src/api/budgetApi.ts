import { axiosClient } from "./axiosClient";
import type { BudgetUpsertRequest } from "../types/api";
import type { Budget } from "../types/models";

export async function fetchBudget(month: number, year: number): Promise<Budget | null> {
  const { data } = await axiosClient.get<Budget | null>("/budgets", { params: { month, year } });
  return data;
}

export async function upsertBudget(payload: BudgetUpsertRequest): Promise<Budget> {
  const { data } = await axiosClient.put<Budget>("/budgets", payload);
  return data;
}
