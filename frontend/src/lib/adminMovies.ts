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
  poster?: File;
  trailerUrl?: string;
}) {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("durationMin", String(data.durationMin));
  formData.append("language", data.language);
  formData.append("genre", data.genre);

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.releaseDate) {
    formData.append("releaseDate", data.releaseDate);
  }

  if (data.poster) {
    formData.append("poster", data.poster);
  }

  if (data.trailerUrl) {
    formData.append("trailerUrl", data.trailerUrl);
  }

  return authFetch<{
    success: boolean;
    data: AdminMovie;
  }>("/api/v1/movies", {
    method: "POST",
    body: formData,
  });
}