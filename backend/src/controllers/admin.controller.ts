import type { Request, Response } from "express";
import * as adminService from "../services/admin.service";

export async function insightsHandler(_req: Request, res: Response): Promise<void> {
  const result = await adminService.getAdminInsights();
  res.status(200).json(result);
}
