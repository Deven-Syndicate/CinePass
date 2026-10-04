import { apiFetch } from "./api";

type LoginResponse = {
  success: boolean;
  data: {
    token: string;
  };
};

export async function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}