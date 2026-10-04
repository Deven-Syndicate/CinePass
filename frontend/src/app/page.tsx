import Image from "next/image";
import Link from "next/link";
import { getMovies } from "@/lib/movies";

export default async function Home() {
  const response = await getMovies();

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-8 text-3xl font-bold">Now Showing</h1>

      {response.data.length === 0 ? (
        <p>No movies available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {response.data.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md"
            >
              {movie.posterUrl ? (
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center bg-gray-100 text-gray-500">
                  No Poster
                </div>
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold">
                  {movie.title}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {movie.genre} • {movie.language}
                </p>

                <p className="mt-2 text-sm">
                  {movie.durationMin} minutes
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}