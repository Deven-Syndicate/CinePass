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

  const toggleSeat = (seatId: number) => {
    setSelectedSeats((current) =>
      current.includes(seatId)
        ? current.filter((id) => id !== seatId)
        : [...current, seatId]
    );
  };

  const total = selectedSeats.length * Number(price);

  const handleContinue = async () => {
    if (selectedSeats.length === 0) return;

    setError("");
    setLoading(true);

    try {
      const response = await createBooking(
        showId,
        selectedSeats
      );

      router.push(`/booking/${response.data.id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create booking"
      );
    } finally {
      setLoading(false);
    }
  };

  const rows = Object.entries(
    seats.reduce<Record<string, Seat[]>>((rows, seat) => {
      if (!rows[seat.row]) {
        rows[seat.row] = [];
      }

      rows[seat.row].push(seat);

      return rows;
    }, {})
  );

  const getSeatClass = (
    seat: Seat,
    selected: boolean
  ) => {
    if (!seat.available) {
      return "cursor-not-allowed border-[#343943] bg-[#252a33] text-gray-600";
    }

    if (selected) {
      return "border-[var(--primary)] bg-[var(--primary)] text-white shadow-[0_0_16px_rgba(229,9,20,0.35)] scale-105";
    }

    if (seat.type === "PREMIUM") {
      return "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20";
    }

    if (seat.type === "RECLINER") {
      return "border-purple-500/40 bg-purple-500/10 text-purple-300 hover:border-purple-400 hover:bg-purple-500/20";
    }

    return "border-[#3b4350] bg-[#151a23] text-gray-300 hover:border-gray-300 hover:bg-[#202631]";
  };

  return (
    <div>

      {/* Legend */}

      <div className="mb-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-gray-400 sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded border border-[#3b4350] bg-[#151a23]" />
          Available
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-[var(--primary)]" />
          Selected
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-[#252a33]" />
          Booked
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded border border-amber-500/40 bg-amber-500/10" />
          Premium
        </div>

        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded border border-purple-500/40 bg-purple-500/10" />
          Recliner
        </div>
      </div>

      {/* Seat layout */}

      <div className="overflow-x-auto pb-6">
        <div className="mx-auto w-fit min-w-max space-y-4">

          {rows.map(([row, rowSeats]) => (
            <div
              key={row}
              className="flex items-center gap-2 sm:gap-3"
            >

              {/* Row label */}

              <span className="mr-2 flex h-9 w-7 items-center justify-center text-xs font-semibold text-gray-500">
                {row}
              </span>

              {/* Seats */}

              <div className="flex gap-2 sm:gap-3">
                {rowSeats.map((seat) => {
                  const selected = selectedSeats.includes(
                    seat.id
                  );

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={!seat.available}
                      onClick={() => toggleSeat(seat.id)}
                      title={`${seat.type} • Seat ${seat.row}${seat.number}`}
                      aria-label={`Seat ${seat.row}${seat.number}`}
                      aria-pressed={selected}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[11px] font-semibold transition duration-200 sm:h-10 sm:w-10 sm:text-xs ${getSeatClass(
                        seat,
                        selected
                      )}`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Selected seats */}

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[#0d1117] p-5">

        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Your selection
        </p>

        {selectedSeats.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            No seats selected yet.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedSeats.map((seatId) => {
              const seat = seats.find(
                (item) => item.id === seatId
              );

              if (!seat) return null;

              return (
                <span
                  key={seat.id}
                  className="rounded-lg bg-[rgba(229,9,20,0.12)] px-3 py-1.5 text-sm font-semibold text-[var(--primary)]"
                >
                  {seat.row}
                  {seat.number}
                </span>
              );
            })}
          </div>
        )}

      </div>

      {/* Booking summary */}

      <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[#10141b] p-5 sm:p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm text-gray-500">
              {selectedSeats.length}{" "}
              {selectedSeats.length === 1
                ? "seat"
                : "seats"}{" "}
              selected
            </p>

            <p className="mt-1 text-sm text-gray-400">
              ₹{Number(price).toFixed(2)} per seat
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Total
            </p>

            <p className="mt-1 text-3xl font-bold">
              ₹{total.toFixed(2)}
            </p>
          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Continue */}

        <button
          type="button"
          onClick={handleContinue}
          disabled={
            selectedSeats.length === 0 || loading
          }
          className="cine-button mt-6 w-full py-3.5"
        >
          {loading
            ? "Creating booking..."
            : selectedSeats.length === 0
              ? "Select Seats to Continue"
              : "Continue to Booking →"}
        </button>

      </div>
    </div>
  );
}