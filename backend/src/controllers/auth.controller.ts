import type { Request, Response } from "express";
import { ApiError } from "../middleware/errorHandler";
import * as authService from "../services/auth.service";
import type { LoginInput, SignupInput } from "../validators/auth.schema";

export async function signupHandler(req: Request, res: Response): Promise<void> {
  const result = await authService.signup(req.body as SignupInput);
  res.status(201).json(result);
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const result = await authService.login(req.body as LoginInput);
  res.status(200).json(result);
}

export async function meHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }
  const user = await authService.getMe(req.user.userId);
  res.status(200).json(user);
}
