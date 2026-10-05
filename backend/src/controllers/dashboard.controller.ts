import type { Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler";
import * as dashboardService from "../services/dashboard.service";

export async function getHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new ApiError(401, "Not authenticated");
  const month = Number(req.query.month);
  const year = Number(req.query.year);
  if (!month || !year) {
    throw new ApiError(400, "month and year query params are required");
  }
  const result = await dashboardService.getUserDashboard(req.user.userId, month, year);
  res.status(200).json(result);
}
