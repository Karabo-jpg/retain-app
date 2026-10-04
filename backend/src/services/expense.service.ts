import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../middleware/errorHandler";
import { serializeDecimals } from "../utils/serialize";
import type { ExpenseBodyInput, ExpenseListQuery } from "../validators/expense.schema";

function buildWhere(userId: string, query: ExpenseListQuery): Prisma.ExpenseWhereInput {
  const where: Prisma.ExpenseWhereInput = { userId };

  if (query.category) where.categoryId = query.category;
  if (query.paymentMethod) where.paymentMethod = query.paymentMethod;
  if (query.dateFrom || query.dateTo) {
    where.date = {
      ...(query.dateFrom ? { gte: query.dateFrom } : {}),
      ...(query.dateTo ? { lte: query.dateTo } : {}),
    };
  }
  if (query.minAmount !== undefined || query.maxAmount !== undefined) {
    where.amount = {
      ...(query.minAmount !== undefined ? { gte: query.minAmount } : {}),
      ...(query.maxAmount !== undefined ? { lte: query.maxAmount } : {}),
    };
  }
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }
  return where;
}

export async function listExpenses(userId: string, query: ExpenseListQuery) {
  const where = buildWhere(userId, query);
  const skip = (query.page - 1) * query.pageSize;

  const [data, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy: { [query.sortBy]: query.sortDir },
      skip,
      take: query.pageSize,
      include: { category: true },
    }),
    prisma.expense.count({ where }),
  ]);

  return serializeDecimals({ data, total, page: query.page, pageSize: query.pageSize });
}

export async function getExpense(userId: string, id: string) {
  const expense = await prisma.expense.findFirst({ where: { id, userId }, include: { category: true } });
  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }
  return serializeDecimals(expense);
}

export async function createExpense(userId: string, input: ExpenseBodyInput) {
  const expense = await prisma.expense.create({
    data: { ...input, userId },
    include: { category: true },
  });
  return serializeDecimals(expense);
}

export async function updateExpense(userId: string, id: string, input: ExpenseBodyInput) {
  const existing = await prisma.expense.findFirst({ where: { id, userId } });
  if (!existing) {
    throw new ApiError(404, "Expense not found");
  }
  const expense = await prisma.expense.update({
    where: { id },
    data: { ...input },
    include: { category: true },
  });
  return serializeDecimals(expense);
}

export async function deleteExpense(userId: string, id: string) {
  const existing = await prisma.expense.findFirst({ where: { id, userId } });
  if (!existing) {
    throw new ApiError(404, "Expense not found");
  }
  await prisma.expense.delete({ where: { id } });
}
