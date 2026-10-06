import { axiosClient } from "./axiosClient";
import type { Category } from "../types/models";

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await axiosClient.get<Category[]>("/categories");
  return data;
}

export async function createCategory(name: string): Promise<Category> {
  const { data } = await axiosClient.post<Category>("/categories", { name });
  return data;
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  const { data } = await axiosClient.put<Category>(`/categories/${id}`, { name });
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await axiosClient.delete(`/categories/${id}`);
}
