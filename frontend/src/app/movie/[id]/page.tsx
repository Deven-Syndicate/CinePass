import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovies } from "@/lib/movies";

type MoviePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MoviePage({
  params,
}: MoviePageProps) {
  const { id } = await params;

  const response = await getMovies();

  const movie = response.data.find(
    (item) => item.id === Number(id)
  );

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero background */}

      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(229,9,20,0.12),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            ← Back to movies
          </Link>

          <div className="flex flex-col gap-10 md:flex-row md:items-start">
            {/* Poster */}

            <div className="relative mx-auto aspect-[2/3] w-full max-w-xs shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] shadow-2xl md:mx-0">
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#10141b] text-gray-500">
                  No Poster
                </div>
              )}
            </div>

            {/* Information */}

            <div className="flex-1 pt-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                Movie
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              {/* Metadata */}

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-[#181d25] px-4 py-2 text-gray-200">
                  {movie.genre}
                </span>

                <span className="rounded-full bg-[#181d25] px-4 py-2 text-gray-200">
                  {movie.language}
                </span>

                <span className="rounded-full bg-[#181d25] px-4 py-2 text-gray-200">
                  {movie.durationMin} min
                </span>
              </div>

              {/* Description */}

              {movie.description && (
                <p className="mt-8 max-w-3xl text-base leading-8 text-gray-400">
                  {movie.description}
                </p>
              )}

              {/* Release */}

              {movie.releaseDate && (
                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Release Date
                  </p>

                  <p className="mt-2 text-gray-200">
                    {new Date(
                      movie.releaseDate
                    ).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* CTA */}

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`/movie/${movie.id}/shows`}
                  className="cine-button px-7 py-3"
                >
                  Book Tickets
                </Link>

                <Link
                  href="/"
                  className="cine-button-secondary px-7 py-3"
                >
                  Browse Movies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom information */}

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="cine-card p-6">
            <p className="text-2xl">🎬</p>
            <h2 className="mt-4 font-semibold">
              Cinema Experience
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Choose your preferred show and cinema seat.
            </p>
          </div>

          <div className="cine-card p-6">
            <p className="text-2xl">💺</p>
            <h2 className="mt-4 font-semibold">
              Pick Your Seat
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Select available seats before confirming your booking.
            </p>
          </div>

          <div className="cine-card p-6">
            <p className="text-2xl">🎟️</p>
            <h2 className="mt-4 font-semibold">
              Digital Ticket
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Receive a secure QR ticket after your booking.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}