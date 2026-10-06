import type { PaymentMethod, User } from "./models";

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ExpenseListParams {
  category?: string;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  sortBy: "date" | "amount" | "title";
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface ExpenseFormValues {
  title: string;
  description?: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  categoryId: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BudgetUpsertRequest {
  month: number;
  year: number;
  amount: number;
}
