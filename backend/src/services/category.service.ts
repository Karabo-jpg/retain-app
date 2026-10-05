import { prisma } from "../config/prisma";
import { ApiError } from "../middleware/errorHandler";
import type { CategoryBodyInput } from "../validators/category.schema";

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function createCategory(input: CategoryBodyInput) {
  const existing = await prisma.category.findUnique({ where: { name: input.name } });
  if (existing) {
    throw new ApiError(409, "A category with this name already exists");
  }
  return prisma.category.create({ data: { name: input.name } });
}

export async function updateCategory(id: string, input: CategoryBodyInput) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  if (category.isDefault) {
    throw new ApiError(400, "The default Uncategorized category cannot be renamed");
  }
  return prisma.category.update({ where: { id }, data: { name: input.name } });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  if (category.isDefault) {
    throw new ApiError(400, "The default Uncategorized category cannot be deleted");
  }

  const fallback = await prisma.category.findFirst({ where: { isDefault: true } });
  if (!fallback) {
    throw new ApiError(500, "No default category configured to reassign expenses to");
  }

  await prisma.$transaction([
    prisma.expense.updateMany({ where: { categoryId: id }, data: { categoryId: fallback.id } }),
    prisma.category.delete({ where: { id } }),
  ]);
}
