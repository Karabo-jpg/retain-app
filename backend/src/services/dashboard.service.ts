import { prisma } from "../config/prisma";
import { serializeDecimals } from "../utils/serialize";

export type BudgetStatus = "no_budget" | "within" | "approaching" | "over";

function computeBudgetStatus(totalSpent: number, budgetAmount: number | null): BudgetStatus {
  if (budgetAmount === null || budgetAmount === 0) return "no_budget";
  const ratio = totalSpent / budgetAmount;
  if (ratio > 1) return "over";
  if (ratio >= 0.8) return "approaching";
  return "within";
}

export async function getUserDashboard(userId: string, month: number, year: number) {
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 1);

  const [expenses, budget] = await Promise.all([
    prisma.expense.findMany({
      where: { userId, date: { gte: monthStart, lt: monthEnd } },
      include: { category: true },
      orderBy: { date: "desc" },
    }),
    prisma.budget.findUnique({ where: { userId_year_month: { userId, year, month } } }),
  ]);

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const budgetAmount = budget ? Number(budget.amount) : null;
  const remainingBudget = budgetAmount !== null ? budgetAmount - totalSpent : null;
  const budgetStatus = computeBudgetStatus(totalSpent, budgetAmount);

  const highestExpense = expenses.reduce<typeof expenses[number] | null>((max, e) => {
    if (!max || Number(e.amount) > Number(max.amount)) return e;
    return max;
  }, null);

  const spendingByCategoryMap = new Map<string, { categoryId: string; categoryName: string; total: number }>();
  for (const e of expenses) {
    const key = e.categoryId;
    const existing = spendingByCategoryMap.get(key);
    const amount = Number(e.amount);
    if (existing) {
      existing.total += amount;
    } else {
      spendingByCategoryMap.set(key, { categoryId: e.categoryId, categoryName: e.category.name, total: amount });
    }
  }

  return serializeDecimals({
    totalSpent,
    budgetAmount,
    remainingBudget,
    budgetStatus,
    highestExpense,
    spendingByCategory: Array.from(spendingByCategoryMap.values()).sort((a, b) => b.total - a.total),
    recentExpenses: expenses.slice(0, 5),
  });
}
