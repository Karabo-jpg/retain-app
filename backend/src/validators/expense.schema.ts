import { z } from "zod";

export const PAYMENT_METHODS = ["CASH", "CARD", "BANK_TRANSFER", "MOBILE_MONEY", "OTHER"] as const;

export const expenseBodySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  amount: z.number().positive(),
  date: z.coerce.date(),
  paymentMethod: z.enum(PAYMENT_METHODS),
  categoryId: z.string().uuid(),
  notes: z.string().max(1000).optional(),
});
export type ExpenseBodyInput = z.infer<typeof expenseBodySchema>;

export const expenseListQuerySchema = z.object({
  category: z.string().uuid().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["date", "amount", "title"]).default("date"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});
export type ExpenseListQuery = z.infer<typeof expenseListQuerySchema>;
