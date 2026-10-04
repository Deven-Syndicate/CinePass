import { apiFetch } from "./api";

export type Movie = {
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

type MoviesResponse = {
  success: boolean;
  data: Movie[];
};

export async function getMovies() {
  return apiFetch<MoviesResponse>("/api/v1/movies");
}