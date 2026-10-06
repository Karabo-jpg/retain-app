import { axiosClient } from "./axiosClient";
import type { UserDashboard } from "../types/models";

export async function fetchDashboard(month: number, year: number): Promise<UserDashboard> {
  const { data } = await axiosClient.get<UserDashboard>("/dashboard", { params: { month, year } });
  return data;
}
