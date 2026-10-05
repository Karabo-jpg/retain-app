import type { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import type { CategoryBodyInput } from "../validators/category.schema";

export async function listHandler(_req: Request, res: Response): Promise<void> {
  const result = await categoryService.listCategories();
  res.status(200).json(result);
}

export async function createHandler(req: Request, res: Response): Promise<void> {
  const result = await categoryService.createCategory(req.body as CategoryBodyInput);
  res.status(201).json(result);
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const result = await categoryService.updateCategory(req.params.id as string, req.body as CategoryBodyInput);
  res.status(200).json(result);
}

export async function deleteHandler(req: Request, res: Response): Promise<void> {
  await categoryService.deleteCategory(req.params.id as string);
  res.status(204).send();
}
