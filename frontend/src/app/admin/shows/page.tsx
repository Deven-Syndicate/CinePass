"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createAdminShow,
  getAdminShows,
  AdminShow,
} from "@/lib/adminShows";
import { getMovies, Movie } from "@/lib/movies";
import { getAdminScreens, AdminScreen } from "@/lib/adminScreens";

export default function AdminShowsPage() {
  const [shows, setShows] = useState<AdminShow[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [screens, setScreens] = useState<AdminScreen[]>([]);

  const [movieId, setMovieId] = useState("");
  const [screenId, setScreenId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [showsResponse, moviesResponse, screensResponse] =
        await Promise.all([
          getAdminShows(),
          getMovies(),
          getAdminScreens(),
        ]);

      setShows(showsResponse.data);
      setMovies(moviesResponse.data);
      setScreens(screensResponse.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load shows"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !movieId ||
      !screenId ||
      !startTime ||
      !endTime ||
      !price
    ) {
      setError("All show fields are required.");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setError("End time must be after start time.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      await createAdminShow({
        movieId: Number(movieId),
        screenId: Number(screenId),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        price: Number(price),
      });

      setMovieId("");
      setScreenId("");
      setStartTime("");
      setEndTime("");
      setPrice("");

      setSuccess("Show created successfully.");

      await loadData();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create show"
      );
    } finally {
      setCreating(false);
    }
  };

  const formatDateTime = (value: string) => {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Admin Management
            </p>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Shows
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              Schedule movies across your cinema screens.
            </p>
          </div>

          <a
            href="/admin"
            className="cine-button-secondary w-fit"
          >
            ← Dashboard
          </a>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        {/* Create Show */}
        <section className="cine-card mb-8 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              Schedule New Show
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Select a movie, screen and show timing.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Movie
              </label>

              <select
                value={movieId}
                onChange={(event) => setMovieId(event.target.value)}
                className="cine-input"
              >
                <option value="">Select movie</option>

                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Screen
              </label>

              <select
                value={screenId}
                onChange={(event) => setScreenId(event.target.value)}
                className="cine-input"
              >
                <option value="">Select screen</option>

                {screens.map((screen) => (
                  <option key={screen.id} value={screen.id}>
                    {screen.cinema?.name} — {screen.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Start Time
              </label>

              <input
                type="datetime-local"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="cine-input"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                End Time
              </label>

              <input
                type="datetime-local"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="cine-input"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Price
              </label>

              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="250"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="cine-input"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-5">
              <button
                type="submit"
                disabled={creating}
                className="cine-button w-full sm:w-auto"
              >
                {creating ? "Creating..." : "Schedule Show"}
              </button>
            </div>
          </form>
        </section>

        {/* Shows */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">
              Scheduled Shows
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {shows.length} show{shows.length !== 1 ? "s" : ""}
            </p>
          </div>

          {loading ? (
            <div className="cine-card p-10 text-center text-[var(--muted)]">
              Loading shows...
            </div>
          ) : shows.length === 0 ? (
            <div className="cine-card p-10 text-center">
              <p className="text-lg font-medium text-white">
                No shows scheduled
              </p>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Create your first show using the form above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {shows.map((show) => (
                <div
                  key={show.id}
                  className="cine-card p-6"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-dark)]">
                        Movie
                      </p>

                      <h3 className="mt-1 text-xl font-semibold text-white">
                        {show.movie.title}
                      </h3>
                    </div>

                    <span className="whitespace-nowrap rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                      Scheduled
                    </span>
                  </div>

                  <div className="grid gap-4 border-t border-[var(--border)] pt-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--muted-dark)]">
                        Cinema
                      </p>

                      <p className="mt-1 font-medium text-gray-200">
                        {show.screen.cinema.name}
                      </p>

                      <p className="text-sm text-[var(--muted)]">
                        {show.screen.cinema.city}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--muted-dark)]">
                        Screen
                      </p>

                      <p className="mt-1 font-medium text-gray-200">
                        {show.screen.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--muted-dark)]">
                        Start
                      </p>

                      <p className="mt-1 text-sm text-gray-200">
                        {formatDateTime(show.startTime)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--muted-dark)]">
                        End
                      </p>

                      <p className="mt-1 text-sm text-gray-200">
                        {formatDateTime(show.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4">
                    <span className="text-sm text-[var(--muted)]">
                      Ticket Price
                    </span>

                    <span className="text-lg font-bold text-white">
                      ₹{Number(show.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}