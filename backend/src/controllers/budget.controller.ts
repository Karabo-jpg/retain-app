import type { Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler";
import * as budgetService from "../services/budget.service";
import type { BudgetQuery, BudgetUpsertInput } from "../validators/budget.schema";

function userId(req: Request): string {
  if (!req.user) throw new ApiError(401, "Not authenticated");
  return req.user.userId;
}

export async function getHandler(req: Request, res: Response): Promise<void> {
  const result = await budgetService.getBudget(userId(req), req.query as unknown as BudgetQuery);
  res.status(200).json(result);
}

export async function upsertHandler(req: Request, res: Response): Promise<void> {
  const result = await budgetService.upsertBudget(userId(req), req.body as BudgetUpsertInput);
  res.status(200).json(result);
}
