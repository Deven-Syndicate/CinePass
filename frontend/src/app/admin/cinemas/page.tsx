"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  AdminCinema,
  createAdminCinema,
  getAdminCinemas,
} from "@/lib/adminCinemas";

export default function AdminCinemasPage() {
  const [cinemas, setCinemas] = useState<AdminCinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
  });

  const loadCinemas = async () => {
    try {
      setLoading(true);

      const response = await getAdminCinemas();

      setCinemas(response.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load cinemas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCinemas();
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSaving(true);

      await createAdminCinema(form);

      setForm({
        name: "",
        address: "",
        city: "",
      });

      setSuccess("Cinema added successfully.");

      await loadCinemas();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create cinema"
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
              Cinemas
            </h1>

            <p className="mt-3 text-sm text-gray-500 sm:text-base">
              Manage cinema locations available on CinePass.
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
            <h2 className="text-xl font-semibold">
              Add Cinema
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Register a new cinema location.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <input
                className="cine-input"
                placeholder="Cinema name"
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
                required
              />

              <textarea
                className="cine-input min-h-28 resize-none"
                placeholder="Full address"
                value={form.address}
                onChange={(event) =>
                  setForm({
                    ...form,
                    address: event.target.value,
                  })
                }
                required
              />

              <input
                className="cine-input"
                placeholder="City"
                value={form.city}
                onChange={(event) =>
                  setForm({
                    ...form,
                    city: event.target.value,
                  })
                }
                required
              />

              <button
                type="submit"
                disabled={saving}
                className="cine-button w-full py-3"
              >
                {saving
                  ? "Adding Cinema..."
                  : "Add Cinema"}
              </button>
            </form>
          </div>

          <div>
            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                Cinema Locations
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {cinemas.length} cinema
                {cinemas.length !== 1 ? "s" : ""} registered
              </p>
            </div>

            {loading ? (
              <div className="cine-card p-8 text-center text-sm text-gray-500">
                Loading cinemas...
              </div>
            ) : cinemas.length === 0 ? (
              <div className="cine-card p-10 text-center">
                <div className="text-4xl">🏢</div>

                <h3 className="mt-4 text-lg font-semibold">
                  No cinemas yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Add your first cinema using the form.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {cinemas.map((cinema) => (
                  <article
                    key={cinema.id}
                    className="cine-card p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#181d25] text-xl">
                        🏢
                      </div>

                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                        Active
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-semibold">
                      {cinema.name}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      {cinema.address}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                      <span>📍</span>
                      <span>{cinema.city}</span>
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