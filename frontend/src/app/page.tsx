import Image from "next/image";
import Link from "next/link";
import { getMovies } from "@/lib/movies";

export default async function Home() {
  const response = await getMovies();
  const movies = response.data;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero */}

      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(229,9,20,0.18),transparent_45%)]" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
              Welcome to CinePass
            </p>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Your movie.
              <br />
              Your seat.
              <br />
              <span className="text-[var(--primary)]">
                Your experience.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Discover the latest movies, choose your perfect seats,
              and book your cinema experience in just a few clicks.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#movies" className="cine-button px-6 py-3">
                Explore Movies
              </a>

              <Link
                href="/login"
                className="cine-button-secondary px-6 py-3"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Movies */}

      <section
        id="movies"
        className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
      >
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)]">
              Discover
            </p>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Now Showing
            </h2>

            <p className="mt-2 text-gray-400">
              Find something worth watching tonight.
            </p>
          </div>

          <span className="hidden text-sm text-gray-500 sm:block">
            {movies.length} {movies.length === 1 ? "movie" : "movies"}
          </span>
        </div>

        {movies.length === 0 ? (
          <div className="cine-card flex min-h-60 items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold">
                No movies available
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Check back soon for new releases.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="cine-card group overflow-hidden"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0d1117]">
                  {movie.posterUrl ? (
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      No Poster
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>

                <div className="p-5">
                  <h3 className="truncate text-lg font-bold">
                    {movie.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-400">
                    {movie.genre} <span className="mx-1">•</span>{" "}
                    {movie.language}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {movie.durationMin} min
                    </span>

                    <span className="text-sm font-semibold text-[var(--primary)]">
                      Book Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Feature strip */}

      <section className="border-t border-[var(--border)] bg-[#0b0e13]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 sm:grid-cols-3 lg:px-8">
          <div>
            <div className="mb-3 text-2xl">🎬</div>
            <h3 className="font-semibold">Latest Movies</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Discover movies currently available at CinePass.
            </p>
          </div>

          <div>
            <div className="mb-3 text-2xl">💺</div>
            <h3 className="font-semibold">Choose Your Seat</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Pick the perfect seat before completing your booking.
            </p>
          </div>

          <div>
            <div className="mb-3 text-2xl">🎟️</div>
            <h3 className="font-semibold">Digital Tickets</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Get a QR-powered ticket ready for cinema entry.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}