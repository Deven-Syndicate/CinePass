import { authFetch } from "./api";

export type AdminCinema = {
  id: number;
  name: string;
  address: string;
  city: string;
};

export async function getAdminCinemas() {
  return authFetch<{
    success: boolean;
    data: AdminCinema[];
  }>("/api/v1/cinemas");
}

export async function createAdminCinema(data: {
  name: string;
  address: string;
  city: string;
}) {
  return authFetch<{
    success: boolean;
    data: AdminCinema;
  }>("/api/v1/cinemas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
