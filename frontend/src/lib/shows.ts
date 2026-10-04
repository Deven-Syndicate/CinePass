import { apiFetch } from "./api";

export type Show = {
  id: number;
  movieId: number;
  screenId: number;
  startTime: string;
  endTime: string;
  price: string;
};

type ShowsResponse = {
  success: boolean;
  data: Show[];
};

export async function getShows() {
  return apiFetch<ShowsResponse>("/api/v1/shows");
}