"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking, type Seat } from "@/lib/seats";

type SeatGridProps = {
  seats: Seat[];
  price: string;
  showId: number;
};

export default function SeatGrid({
  
  seats,
  price,
  showId,
}: SeatGridProps) {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleSeat = (seatId: number) => {
    setSelectedSeats((current) =>
      current.includes(seatId)
        ? current.filter((id) => id !== seatId)
        : [...current, seatId]
    );
  };

  const total = selectedSeats.length * Number(price);

  const handleContinue = async () => {
  setError("");
  setSuccess("");
  setLoading(true);

  try {
    const response = await createBooking(showId, selectedSeats);

    router.push(`/booking/${response.data.id}`);

    console.log("Booking created:", response.data);
  } catch (error) {
    setError(
      error instanceof Error ? error.message : "Failed to create booking"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      {/* Screen */}
      <div className="mx-auto mb-10 max-w-2xl">
        <div className="h-2 rounded-full bg-black" />

        <p className="mt-3 text-center text-xs font-medium tracking-widest text-gray-400">
          SCREEN
        </p>
      </div>

      {/* Legend */}
      <div className="mb-8 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded border bg-gray-100" />
            Available
          </div>

          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded bg-black" />
            Selected
          </div>

          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded border bg-gray-300" />
            Booked
          </div>
        </div>

      {/* Seats */}
      <div className="space-y-4 overflow-x-auto pb-4">
        {Object.entries(
          seats.reduce<Record<string, Seat[]>>((rows, seat) => {
            if (!rows[seat.row]) {
              rows[seat.row] = [];
            }

            rows[seat.row].push(seat);

            return rows;
          }, {})
        ).map(([row, rowSeats]) => (
          <div
            key={row}
            className="flex min-w-max items-center justify-center gap-3"
          >
            <span className="w-6 text-center text-sm font-semibold text-gray-500">
              {row}
            </span>

            {rowSeats.map((seat) => {
              const selected = selectedSeats.includes(seat.id);
              const unavailable = !seat.available;

              return (
                <button
                  key={seat.id}
                  disabled={unavailable}
                  onClick={() => toggleSeat(seat.id)}
                  className={
                    unavailable
                      ? "flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-md border border-gray-300 bg-gray-300 text-xs font-semibold text-gray-500"
                      : selected
                        ? "flex h-10 w-10 items-center justify-center rounded-md bg-black text-xs font-semibold text-white shadow-md transition hover:scale-105"
                        : "flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-gray-100 text-xs font-semibold text-gray-800 transition hover:border-black hover:bg-gray-200"
                  }
                >
                  {seat.number}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-10 rounded-xl border bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Selected seats
            </p>

            <p className="mt-1 font-semibold">
              {selectedSeats.length === 0
                ? "None"
                : selectedSeats.length}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="mt-1 text-2xl font-bold">
              ₹{total.toFixed(2)}
            </p>
          </div>
        </div>
        
        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-4 rounded-lg bg-green-100 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </p>
        )}

        <button
        onClick={handleContinue}
        disabled={selectedSeats.length === 0 || loading}
          className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Creating booking..." : "Continue"}
        </button>
      </div>
    </div>
  );
}