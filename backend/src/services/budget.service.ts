import { prisma } from "../config/prisma";
import { serializeDecimals } from "../utils/serialize";
import type { BudgetQuery, BudgetUpsertInput } from "../validators/budget.schema";

export async function getBudget(userId: string, query: BudgetQuery) {
  const budget = await prisma.budget.findUnique({
    where: { userId_year_month: { userId, year: query.year, month: query.month } },
  });
  return serializeDecimals(budget);
}

export async function upsertBudget(userId: string, input: BudgetUpsertInput) {
  const budget = await prisma.budget.upsert({
    where: { userId_year_month: { userId, year: input.year, month: input.month } },
    update: { amount: input.amount },
    create: { userId, year: input.year, month: input.month, amount: input.amount },
  });
  return serializeDecimals(budget);
}
