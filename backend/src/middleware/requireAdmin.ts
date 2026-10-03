import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./errorHandler";

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.role !== "ADMIN") {
    throw new ApiError(403, "Admin role required");
  }
  next();
}
