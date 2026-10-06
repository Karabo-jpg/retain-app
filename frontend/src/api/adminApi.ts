import { axiosClient } from "./axiosClient";
import type { AdminInsights } from "../types/models";

export async function fetchAdminInsights(): Promise<AdminInsights> {
  const { data } = await axiosClient.get<AdminInsights>("/admin/insights");
  return data;
}
