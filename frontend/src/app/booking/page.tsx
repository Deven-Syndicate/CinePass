"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBookings, type Booking } from "@/lib/bookings";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await getBookings();
        setBookings(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-[var(--primary)]" />
          <p className="mt-4 text-sm text-gray-500">
            Loading your bookings...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">

        {/* Header */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Your account
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            My Bookings
          </h1>

          <p className="mt-3 text-gray-500">
            View your movie bookings and tickets.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}

        {!error && bookings.length === 0 && (
          <div className="cine-card mt-10 flex min-h-72 items-center justify-center">
            <div className="text-center">
              <div className="text-5xl">🎟️</div>

              <h2 className="mt-5 text-xl font-semibold">
                No bookings yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Your movie bookings will appear here.
              </p>

              <Link
                href="/"
                className="cine-button mt-6"
              >
                Browse Movies
              </Link>
            </div>
          </div>
        )}

        {/* Booking list */}

        <div className="mt-10 space-y-5">
          {bookings.map((booking) => {
            const start = new Date(
              booking.show.startTime
            );

            const end = new Date(
              booking.show.endTime
            );

            const seats = booking.bookingSeats
              .map(
                (item) =>
                  `${item.seat.row}${item.seat.number}`
              )
              .join(", ");

            const isConfirmed =
              booking.status === "CONFIRMED";

            return (
              <div
                key={booking.id}
                className="cine-card overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">

                  {/* Poster */}

                  <div className="relative aspect-[16/9] w-full shrink-0 bg-[#0d1117] md:aspect-[2/3] md:w-44">
                    {booking.show.movie.posterUrl ? (
                      <Image
                        src={
                          booking.show.movie.posterUrl
                        }
                        alt={
                          booking.show.movie.title
                        }
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-600">
                        🎬
                      </div>
                    )}
                  </div>

                  {/* Details */}

                  <div className="flex-1 p-6 sm:p-7">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                          Booking #{booking.id}
                        </p>

                        <h2 className="mt-2 text-2xl font-bold">
                          {booking.show.movie.title}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                          {booking.show.movie.genre}{" "}
                          •{" "}
                          {booking.show.movie.language}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                          isConfirmed
                            ? "bg-green-500/10 text-green-400"
                            : booking.status === "EXPIRED"
                              ? "bg-gray-500/10 text-gray-500"
                              : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {booking.status}
                      </span>

                    </div>

                    {/* Show information */}

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">

                      <div className="rounded-xl bg-[#0d1117] p-4">
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          Date & Time
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {start.toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          {start.toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}{" "}
                          –{" "}
                          {end.toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#0d1117] p-4">
                        <p className="text-xs uppercase tracking-wider text-gray-600">
                          Cinema
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {booking.show.screen.cinema.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          {booking.show.screen.name}
                        </p>
                      </div>

                    </div>

                    {/* Bottom information */}

                    <div className="mt-5 flex flex-col gap-4 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-xs text-gray-600">
                          Seats
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {seats || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600">
                          Total
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          ₹
                          {Number(
                            booking.totalAmount
                          ).toFixed(2)}
                        </p>
                      </div>

                      {booking.ticket && (
                        <Link
                          href={`/booking/${booking.id}`}
                          className="cine-button-secondary"
                        >
                          View Ticket
                        </Link>
                      )}

                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}