"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/api";

type DashboardData = {
  movies: number;
  cinemas: number;
  screens: number;
  shows: number;
  bookings: number;
};

export default function AdminPage() {
  const [data, setData] = useState<DashboardData>({
    movies: 0,
    cinemas: 0,
    screens: 0,
    shows: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          moviesResponse,
          cinemasResponse,
          screensResponse,
          showsResponse,
          bookingsResponse,
        ] = await Promise.all([
          authFetch<{ success: boolean; data: unknown[] }>(
            "/api/v1/movies"
          ),
          authFetch<{ success: boolean; data: unknown[] }>(
            "/api/v1/cinemas"
          ),
          authFetch<{ success: boolean; data: unknown[] }>(
            "/api/v1/screens"
          ),
          authFetch<{ success: boolean; data: unknown[] }>(
            "/api/v1/shows"
          ),
          authFetch<{ success: boolean; data: unknown[] }>(
            "/api/v1/bookings"
          ),
        ]);

        setData({
          movies: moviesResponse.data.length,
          cinemas: cinemasResponse.data.length,
          screens: screensResponse.data.length,
          shows: showsResponse.data.length,
          bookings: bookingsResponse.data.length,
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      label: "Movies",
      value: data.movies,
      icon: "🎬",
      href: "/admin/movies",
    },
    {
      label: "Cinemas",
      value: data.cinemas,
      icon: "🏢",
      href: "/admin/cinemas",
    },
    {
      label: "Screens",
      value: data.screens,
      icon: "🖥️",
      href: "/admin/screens",
    },
    {
      label: "Shows",
      value: data.shows,
      icon: "🕐",
      href: "/admin/shows",
    },
    {
      label: "Bookings",
      value: data.bookings,
      icon: "🎟️",
      href: "/admin/bookings",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Administration
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Manage movies, cinemas, screens, shows and
              customer bookings from one place.
            </p>
          </div>

          <Link
            href="/"
            className="cine-button-secondary w-fit"
          >
            ← Back to CinePass
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Stats */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="cine-card group p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(229,9,20,0.1)] text-xl">
                  {stat.icon}
                </div>

                <span className="text-gray-600 transition group-hover:text-gray-300">
                  →
                </span>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                {stat.label}
              </p>

              <p className="mt-1 text-3xl font-bold">
                {loading ? "—" : stat.value}
              </p>
            </Link>
          ))}
        </section>

        {/* Management */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quickly access the areas you manage most often.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ManagementCard
              href="/admin/movies"
              icon="🎬"
              title="Movies"
              description="Add and manage movies available on CinePass."
            />

            <ManagementCard
              href="/admin/cinemas"
              icon="🏢"
              title="Cinemas"
              description="Manage cinema locations and their details."
            />

            <ManagementCard
              href="/admin/screens"
              icon="🖥️"
              title="Screens"
              description="Create and manage cinema screens."
            />

            <ManagementCard
              href="/admin/shows"
              icon="🕐"
              title="Shows"
              description="Schedule movies across your cinema screens."
            />

            <ManagementCard
              href="/admin/bookings"
              icon="🎟️"
              title="Bookings"
              description="View customer bookings and their status."
            />

            <ManagementCard
              href="/scanner"
              icon="📷"
              title="Ticket Scanner"
              description="Open the staff QR ticket verification system."
            />
          </div>
        </section>

        {/* System status */}
        <section className="cine-card mt-10 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">
                CinePass System
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Backend services and database management are
                connected through the CinePass API.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Operational
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ManagementCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="cine-card group p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#181d25] text-xl">
          {icon}
        </div>

        <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-gray-300">
          →
        </span>
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </Link>
  );
}