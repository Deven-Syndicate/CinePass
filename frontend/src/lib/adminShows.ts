import { authFetch } from "./api";

export type AdminShow = {
  id: number;
  movieId: number;
  screenId: number;
  startTime: string;
  endTime: string;
  price: string;
  movie: {
    id: number;
    title: string;
  };
  screen: {
    id: number;
    name: string;
    cinema: {
      id: number;
      name: string;
      city: string;
    };
  };
};

export async function getAdminShows() {
  return authFetch<{
    success: boolean;
    data: AdminShow[];
  }>("/api/v1/shows");
}

export async function createAdminShow(data: {
  movieId: number;
  screenId: number;
  startTime: string;
  endTime: string;
  price: number;
}) {
  return authFetch<{
    success: boolean;
    data: AdminShow;
  }>("/api/v1/shows", {
    method: "POST",
    body: JSON.stringify(data),
  });
}