"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { getMovies } from "@/lib/movies";
import {
  AdminMovie,
  createAdminMovie,
} from "@/lib/adminMovies";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    durationMin: "",
    language: "",
    genre: "",
    description: "",
    releaseDate: "",
    poster: null as File | null,
    trailerUrl: "",
  });

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await getMovies();
      setMovies(response.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load movies"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSaving(true);

      await createAdminMovie({
        title: form.title,
        durationMin: Number(form.durationMin),
        language: form.language,
        genre: form.genre,
        description: form.description || undefined,
        releaseDate: form.releaseDate || undefined,
        poster: form.poster || undefined,
        trailerUrl: form.trailerUrl || undefined,
      });

      setForm({
        title: "",
        durationMin: "",
        language: "",
        genre: "",
        description: "",
        releaseDate: "",
        poster: null,
        trailerUrl: "",
      });

      setSuccess("Movie added successfully.");
      await loadMovies();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create movie"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Administration
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Movies
            </h1>

            <p className="mt-3 text-sm text-gray-500 sm:text-base">
              Add and manage movies available on CinePass.
            </p>
          </div>

          <Link
            href="/admin"
            className="cine-button-secondary w-fit"
          >
            ← Dashboard
          </Link>
        </div>

        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-8 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-400">
            {success}
          </div>
        )}

        <section className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="cine-card h-fit p-6">
            <div>
              <h2 className="text-xl font-semibold">
                Add Movie
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add a new movie to the CinePass catalog.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <input
                className="cine-input"
                placeholder="Movie title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                required
              />

              <input
                className="cine-input"
                type="number"
                min="1"
                placeholder="Duration in minutes"
                value={form.durationMin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    durationMin: e.target.value,
                  })
                }
                required
              />

              <input
                className="cine-input"
                placeholder="Language"
                value={form.language}
                onChange={(e) =>
                  setForm({
                    ...form,
                    language: e.target.value,
                  })
                }
                required
              />

              <input
                className="cine-input"
                placeholder="Genre"
                value={form.genre}
                onChange={(e) =>
                  setForm({
                    ...form,
                    genre: e.target.value,
                  })
                }
                required
              />

              <textarea
                className="cine-input min-h-24 resize-none"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />

              <input
                className="cine-input"
                type="date"
                value={form.releaseDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    releaseDate: e.target.value,
                  })
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Poster
                </label>

                <input
                  className="cine-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      poster: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>

              <input
                className="cine-input"
                placeholder="Trailer URL"
                value={form.trailerUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    trailerUrl: e.target.value,
                  })
                }
              />

              <button
                type="submit"
                disabled={saving}
                className="cine-button w-full"
              >
                {saving ? "Adding Movie..." : "Add Movie"}
              </button>
            </form>
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Movie Catalog
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {movies.length} movie
                  {movies.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>

            {loading ? (
              <div className="cine-card p-8 text-center text-sm text-gray-500">
                Loading movies...
              </div>
            ) : movies.length === 0 ? (
              <div className="cine-card p-10 text-center">
                <div className="text-4xl">🎬</div>

                <h3 className="mt-4 text-lg font-semibold">
                  No movies yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Add your first movie using the form.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {movies.map((movie) => (
                  <article
                    key={movie.id}
                    className="cine-card overflow-hidden"
                  >
                    <div className="aspect-[2/3] bg-[#181d25]">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                          🎬
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="truncate text-lg font-semibold">
                        {movie.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#181d25] px-3 py-1 text-xs text-gray-400">
                          {movie.genre}
                        </span>

                        <span className="rounded-full bg-[#181d25] px-3 py-1 text-xs text-gray-400">
                          {movie.language}
                        </span>

                        <span className="rounded-full bg-[#181d25] px-3 py-1 text-xs text-gray-400">
                          {movie.durationMin} min
                        </span>
                      </div>

                      {movie.description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                          {movie.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}