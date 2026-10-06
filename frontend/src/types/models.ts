export type Role = "USER" | "ADMIN";

export type PaymentMethod = "CASH" | "CARD" | "BANK_TRANSFER" | "MOBILE_MONEY" | "OTHER";

export const PAYMENT_METHODS: PaymentMethod[] = ["CASH", "CARD", "BANK_TRANSFER", "MOBILE_MONEY", "OTHER"];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  description?: string | null;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string | null;
  categoryId: string;
  category: Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  month: number;
  year: number;
  amount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type BudgetStatus = "no_budget" | "within" | "approaching" | "over";

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  total: number;
}

export interface CategoryUsage extends CategorySpending {
  count: number;
}

export interface UserDashboard {
  totalSpent: number;
  budgetAmount: number | null;
  remainingBudget: number | null;
  budgetStatus: BudgetStatus;
  highestExpense: Expense | null;
  spendingByCategory: CategorySpending[];
  recentExpenses: Expense[];
}

export interface AdminInsights {
  totalUsers: number;
  totalExpenses: number;
  totalExpenseValue: number;
  expensesThisMonth: number;
  spendingByCategory: CategoryUsage[];
  topCategories: CategoryUsage[];
  bottomCategories: CategoryUsage[];
  recentExpenses: Expense[];
  recentUsers: Pick<User, "id" | "name" | "email" | "role" | "createdAt">[];
}
