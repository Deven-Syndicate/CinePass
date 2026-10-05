import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovies } from "@/lib/movies";
import { getShows } from "@/lib/shows";

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
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">

        {/* Header */}

        <Link
          href={`/movie/${movie.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          ← Back to movie
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Choose your show
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {movie.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-400">
            <span>{movie.genre}</span>
            <span>•</span>
            <span>{movie.language}</span>
            <span>•</span>
            <span>{movie.durationMin} min</span>
          </div>
        </div>

        {/* Shows */}

        {shows.length === 0 ? (
          <div className="cine-card mt-12 flex min-h-64 items-center justify-center">
            <div className="text-center">
              <div className="text-4xl">🎬</div>

              <h2 className="mt-4 text-xl font-semibold">
                No shows available
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                There are currently no shows scheduled for this movie.
              </p>

              <Link
                href="/"
                className="cine-button mt-6"
              >
                Browse Other Movies
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Available Shows
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select a time to continue to seat selection.
                </p>
              </div>

              <span className="hidden rounded-full bg-[#181d25] px-4 py-2 text-sm text-gray-400 sm:block">
                {shows.length}{" "}
                {shows.length === 1 ? "show" : "shows"}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shows.map((show) => {
                const start = new Date(show.startTime);
                const end = new Date(show.endTime);

                return (
                  <div
                    key={show.id}
                    className="cine-card group p-6"
                  >
                    {/* Date */}

                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(229,9,20,0.12)] text-lg">
                        🕐
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {start.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>

                        <p className="text-xs text-gray-500">
                          {start.toLocaleDateString("en-US", {
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Time */}

                    <div className="mt-7">
                      <p className="text-3xl font-bold">
                        {start.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Ends at{" "}
                        {end.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Price */}

                    <div className="mt-6 flex items-end justify-between border-t border-[var(--border)] pt-5">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500">
                          Ticket price
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          ₹{show.price}
                        </p>
                      </div>

                      <span className="text-sm text-gray-500">
                        per seat
                      </span>
                    </div>

                    {/* CTA */}

                    <Link
                      href={`/show/${show.id}/seats`}
                      className="cine-button mt-6 w-full"
                    >
                      Select Seats →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}