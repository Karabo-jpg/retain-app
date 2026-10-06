import { axiosClient } from "./axiosClient";
import type { AuthResponse, LoginRequest, SignupRequest } from "../types/api";
import type { User } from "../types/models";

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  const { data } = await axiosClient.post<AuthResponse>("/auth/signup", payload);
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await axiosClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await axiosClient.get<User>("/auth/me");
  return data;
}
