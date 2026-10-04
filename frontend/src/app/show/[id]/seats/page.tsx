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

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">
          Select Your Seats
        </h1>

        <p className="mt-2 text-gray-500">
          Show #{show.id}
        </p>

        <div className="mt-10 rounded-xl border p-6">
          <div className="mb-10 rounded-lg bg-gray-100 py-3 text-center font-semibold">
            SCREEN
          </div>

          {seats.length === 0 ? (
            <p>No seats available.</p>
          ) : (
            <SeatGrid
              seats={seats}
              price={show.price}
              showId={show.id}
            />
          )}
        </div>
      </div>
    </main>
  );
}