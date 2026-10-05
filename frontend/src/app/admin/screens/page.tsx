"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createAdminScreen,
  getAdminScreens,
  AdminScreen,
} from "@/lib/adminScreens";
import { getAdminCinemas, AdminCinema } from "@/lib/adminCinemas";

export default function AdminScreensPage() {
  const [screens, setScreens] = useState<AdminScreen[]>([]);
  const [cinemas, setCinemas] = useState<AdminCinema[]>([]);

  const [name, setName] = useState("");
  const [cinemaId, setCinemaId] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [screensResponse, cinemasResponse] = await Promise.all([
        getAdminScreens(),
        getAdminCinemas(),
      ]);

      setScreens(screensResponse.data);
      setCinemas(cinemasResponse.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load screens"
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

    if (!name.trim() || !cinemaId) {
      setError("Screen name and cinema are required.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      await createAdminScreen({
        name: name.trim(),
        cinemaId: Number(cinemaId),
      });

      setName("");
      setCinemaId("");
      setSuccess("Screen created successfully.");

      await loadData();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create screen"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Admin Management
            </p>

            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Screens
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              Manage cinema screens used for movie shows.
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

        {/* Add Screen */}
        <section className="cine-card mb-8 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              Add New Screen
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Assign a screen to one of your cinemas.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Screen Name
              </label>

              <input
                type="text"
                placeholder="Screen 1"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="cine-input"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Cinema
              </label>

              <select
                value={cinemaId}
                onChange={(event) => setCinemaId(event.target.value)}
                className="cine-input"
              >
                <option value="">Select cinema</option>

                {cinemas.map((cinema) => (
                  <option key={cinema.id} value={cinema.id}>
                    {cinema.name} — {cinema.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={creating}
                className="cine-button w-full md:w-auto"
              >
                {creating ? "Creating..." : "Add Screen"}
              </button>
            </div>
          </form>
        </section>

        {/* Screens */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Existing Screens
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {screens.length} screen{screens.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="cine-card p-10 text-center text-[var(--muted)]">
              Loading screens...
            </div>
          ) : screens.length === 0 ? (
            <div className="cine-card p-10 text-center">
              <p className="text-lg font-medium text-white">
                No screens yet
              </p>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Create your first cinema screen above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {screens.map((screen) => (
                <div
                  key={screen.id}
                  className="cine-card p-6"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-dark)]">
                        Screen
                      </p>

                      <h3 className="mt-1 text-xl font-semibold text-white">
                        {screen.name}
                      </h3>
                    </div>

                    <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                      Active
                    </span>
                  </div>

                  <div className="border-t border-[var(--border)] pt-4">
                    <p className="text-sm font-medium text-gray-300">
                      {screen.cinema?.name ?? "Unknown Cinema"}
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {screen.cinema?.city ?? "Unknown City"}
                    </p>
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