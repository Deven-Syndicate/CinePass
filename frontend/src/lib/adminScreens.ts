import { authFetch } from "./api";

export type AdminScreen = {
  id: number;
  name: string;
  cinemaId: number;
  cinema?: {
    id: number;
    name: string;
    city: string;
  };
};

export async function getAdminScreens() {
  return authFetch<{
    success: boolean;
    data: AdminScreen[];
  }>("/api/v1/screens");
}

export async function createAdminScreen(data: {
  name: string;
  cinemaId: number;
}) {
  return authFetch<{
    success: boolean;
    data: AdminScreen;
  }>("/api/v1/screens", {
    method: "POST",
    body: JSON.stringify(data),
  });
}