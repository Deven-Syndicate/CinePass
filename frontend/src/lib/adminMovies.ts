import { authFetch } from "./api";

export type AdminMovie = {
  id: number;
  title: string;
  description: string | null;
  durationMin: number;
  language: string;
  genre: string;
  releaseDate: string | null;
  posterUrl: string | null;
  trailerUrl: string | null;
};

export async function createAdminMovie(data: {
  title: string;
  durationMin: number;
  language: string;
  genre: string;
  description?: string;
  releaseDate?: string;
  posterUrl?: string;
  trailerUrl?: string;
}) {
  return authFetch<{
    success: boolean;
    data: AdminMovie;
  }>("/api/v1/movies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}