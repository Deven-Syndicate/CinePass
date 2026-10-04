import { notFound } from "next/navigation";
import { getMovies } from "@/lib/movies";
import { getShows } from "@/lib/shows";
import Link from "next/link";

type ShowsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ShowsPage({
  params,
}: ShowsPageProps) {
  const { id } = await params;
  const movieId = Number(id);

  const [moviesResponse, showsResponse] = await Promise.all([
    getMovies(),
    getShows(),
  ]);

  const movie = moviesResponse.data.find(
    (item) => item.id === movieId
  );

  if (!movie) {
    notFound();
  }

  const shows = showsResponse.data.filter(
    (show) => show.movieId === movieId
  );

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">
          Select a Show
        </h1>

        <p className="mt-2 text-gray-500">
          {movie.title}
        </p>

        {shows.length === 0 ? (
          <p className="mt-8">
            No shows available for this movie.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shows.map((show) => (
              <div
                key={show.id}
                className="rounded-xl border p-5 shadow-sm"
              >
                <p className="font-semibold">
                {new Date(show.startTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
                {" · "}
                {new Date(show.startTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                })}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                Ends ·{" "}
                {new Date(show.endTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                })}
                </p>

                <p className="mt-4 font-medium">
                  ₹{show.price}
                </p>

                <Link
                href={`/show/${show.id}/seats`}
                className="mt-4 block w-full rounded-lg bg-black px-4 py-2 text-center text-white transition hover:bg-gray-800"
                >
                Select Seats
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}