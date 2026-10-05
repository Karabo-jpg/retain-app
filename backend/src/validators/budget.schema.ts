import { z } from "zod";

export const budgetQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});
export type BudgetQuery = z.infer<typeof budgetQuerySchema>;

export const budgetUpsertSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  amount: z.number().positive(),
});
export type BudgetUpsertInput = z.infer<typeof budgetUpsertSchema>;
