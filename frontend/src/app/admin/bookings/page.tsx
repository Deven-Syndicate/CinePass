"use client";

import { useEffect, useState } from "react";
import {
  getAdminBookings,
  AdminBooking,
} from "@/lib/adminBookings";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminBookings();
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

  useEffect(() => {
    loadBookings();
  }, []);

  const formatDateTime = (value: string) => {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "SUCCESS":
      case "ACTIVE":
        return "border-green-500/20 bg-green-500/10 text-green-400";

      case "PENDING":
      case "PAYMENT_PENDING":
      case "CREATED":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

      case "CANCELLED":
      case "FAILED":
      case "EXPIRED":
        return "border-red-500/20 bg-red-500/10 text-red-400";

      default:
        return "border-gray-500/20 bg-gray-500/10 text-gray-400";
    }
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
              Bookings
            </h1>

            <p className="mt-2 text-[var(--muted)]">
              Monitor customer bookings, payments and tickets.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadBookings}
              className="cine-button-secondary"
            >
              Refresh
            </button>

            <a
              href="/admin"
              className="cine-button-secondary"
            >
              ← Dashboard
            </a>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Summary */}
        {!loading && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="cine-card p-5">
              <p className="text-sm text-[var(--muted)]">
                Total Bookings
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {bookings.length}
              </p>
            </div>

            <div className="cine-card p-5">
              <p className="text-sm text-[var(--muted)]">
                Confirmed
              </p>

              <p className="mt-2 text-3xl font-bold text-green-400">
                {
                  bookings.filter(
                    (booking) => booking.status === "CONFIRMED"
                  ).length
                }
              </p>
            </div>

            <div className="cine-card p-5">
              <p className="text-sm text-[var(--muted)]">
                Pending
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-400">
                {
                  bookings.filter(
                    (booking) =>
                      booking.status === "PENDING" ||
                      booking.status === "PAYMENT_PENDING"
                  ).length
                }
              </p>
            </div>

            <div className="cine-card p-5">
              <p className="text-sm text-[var(--muted)]">
                Revenue
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                ₹
                {bookings
                  .filter(
                    (booking) => booking.status === "CONFIRMED"
                  )
                  .reduce(
                    (total, booking) =>
                      total + Number(booking.totalAmount),
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Bookings */}
        {loading ? (
          <div className="cine-card p-10 text-center text-[var(--muted)]">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="cine-card p-10 text-center">
            <p className="text-lg font-medium text-white">
              No bookings yet
            </p>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Customer bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="cine-card overflow-hidden"
              >
                {/* Booking Header */}
                <div className="flex flex-col gap-4 border-b border-[var(--border)] p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-white">
                        Booking #{booking.id}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Created {formatDateTime(booking.createdAt)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs uppercase tracking-wider text-[var(--muted-dark)]">
                      Total
                    </p>

                    <p className="text-2xl font-bold text-white">
                      ₹{Number(booking.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid gap-6 p-6 lg:grid-cols-3">
                  {/* Customer */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-dark)]">
                      Customer
                    </p>

                    <p className="font-semibold text-white">
                      {booking.user.name}
                    </p>

                    <p className="mt-1 break-all text-sm text-[var(--muted)]">
                      {booking.user.email}
                    </p>
                  </div>

                  {/* Movie */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-dark)]">
                      Movie
                    </p>

                    <p className="font-semibold text-white">
                      {booking.show.movie.title}
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {booking.show.screen.cinema.name}
                    </p>

                    <p className="text-sm text-[var(--muted)]">
                      {booking.show.screen.cinema.city}
                    </p>
                  </div>

                  {/* Show */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-dark)]">
                      Show
                    </p>

                    <p className="font-semibold text-white">
                      {booking.show.screen.name}
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {formatDateTime(booking.show.startTime)}
                    </p>

                    <p className="text-sm text-[var(--muted)]">
                      Ends {formatDateTime(booking.show.endTime)}
                    </p>
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="grid gap-5 border-t border-[var(--border)] bg-[#0c1016] p-6 md:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--muted-dark)]">
                      Seats
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {booking.bookingSeats.map((item) => (
                        <span
                          key={item.id}
                          className="rounded-lg border border-[var(--border)] bg-[#11151c] px-3 py-1.5 text-sm font-medium text-gray-200"
                        >
                          {item.seat.row}
                          {item.seat.number}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--muted-dark)]">
                      Payment
                    </p>

                    <div className="mt-2">
                      {booking.payment ? (
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                            booking.payment.status
                          )}`}
                        >
                          {booking.payment.status}
                        </span>
                      ) : (
                        <span className="text-sm text-[var(--muted)]">
                          No payment
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--muted-dark)]">
                      Ticket
                    </p>

                    <div className="mt-2">
                      {booking.ticket ? (
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                            booking.ticket.status
                          )}`}
                        >
                          {booking.ticket.status}
                        </span>
                      ) : (
                        <span className="text-sm text-[var(--muted)]">
                          No ticket
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}