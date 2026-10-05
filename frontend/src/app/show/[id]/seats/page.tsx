import Link from "next/link";
import { notFound } from "next/navigation";
import { getShows } from "@/lib/shows";
import { getShowSeats } from "@/lib/seats";
import SeatGrid from "./SeatGrid";

type SeatPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SeatPage({
  params,
}: SeatPageProps) {
  const { id } = await params;
  const showId = Number(id);

  const [showsResponse, seatsResponse] = await Promise.all([
    getShows(),
    getShowSeats(showId),
  ]);

  const show = showsResponse.data.find(
    (item) => item.id === showId
  );

  if (!show) {
    notFound();
  }

  const seats = seatsResponse.data.filter(
    (seat) => seat.screenId === show.screenId
  );

  const start = new Date(show.startTime);
  const end = new Date(show.endTime);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

        {/* Back */}

        <Link
          href={`/movie/${show.movieId}/shows`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          ← Back to shows
        </Link>

        {/* Header */}

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Seat Selection
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose Your Seats
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span className="rounded-full bg-[#181d25] px-4 py-2">
              Show #{show.id}
            </span>

            <span className="rounded-full bg-[#181d25] px-4 py-2">
              {start.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>

            <span className="rounded-full bg-[#181d25] px-4 py-2">
              {start.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}{" "}
              –{" "}
              {end.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Seat selection card */}

        <div className="cine-card mt-10 overflow-hidden">

          {/* Cinema header */}

          <div className="border-b border-[var(--border)] px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  Select your seats
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Choose available seats from the layout below.
                </p>
              </div>

              <div className="hidden rounded-lg bg-[#181d25] px-4 py-2 text-sm text-gray-400 sm:block">
                ₹{show.price} / seat
              </div>
            </div>
          </div>

          <div className="px-4 py-8 sm:px-8 sm:py-10">

            {/* Screen */}

            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-70" />

                <div className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
                  Screen
                </div>
              </div>
            </div>

            {/* Seats */}

            {seats.length === 0 ? (
              <div className="flex min-h-64 items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl">💺</div>

                  <h3 className="mt-4 text-lg font-semibold">
                    No seats available
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Seats for this show are currently unavailable.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-12">
                <SeatGrid
                  seats={seats}
                  price={show.price}
                  showId={show.id}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}