import type { Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler";
import * as expenseService from "../services/expense.service";
import type { ExpenseBodyInput, ExpenseListQuery } from "../validators/expense.schema";

function userId(req: Request): string {
  if (!req.user) throw new ApiError(401, "Not authenticated");
  return req.user.userId;
}

export async function listHandler(req: Request, res: Response): Promise<void> {
  const result = await expenseService.listExpenses(userId(req), req.query as unknown as ExpenseListQuery);
  res.status(200).json(result);
}

export async function getHandler(req: Request, res: Response): Promise<void> {
  const result = await expenseService.getExpense(userId(req), req.params.id as string);
  res.status(200).json(result);
}

export async function createHandler(req: Request, res: Response): Promise<void> {
  const result = await expenseService.createExpense(userId(req), req.body as ExpenseBodyInput);
  res.status(201).json(result);
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const result = await expenseService.updateExpense(userId(req), req.params.id as string, req.body as ExpenseBodyInput);
  res.status(200).json(result);
}

export async function deleteHandler(req: Request, res: Response): Promise<void> {
  await expenseService.deleteExpense(userId(req), req.params.id as string);
  res.status(204).send();
}
