import Image from "next/image";
import { notFound } from "next/navigation";
import { getMovies } from "@/lib/movies";
import Link from "next/link";

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
    <main className="min-h-screen p-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row">
        
        {movie.posterUrl ? (
          <div className="relative aspect-[2/3] w-full max-w-sm overflow-hidden rounded-xl">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[2/3] w-full max-w-sm items-center justify-center rounded-xl bg-gray-100 text-gray-500">
            No Poster
          </div>
        )}

        <div className="flex-1">
            
          <h1 className="text-4xl font-bold">
            {movie.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">
            <span>{movie.genre}</span>
            <span>•</span>
            <span>{movie.language}</span>
            <span>•</span>
            <span>{movie.durationMin} min</span>
          </div>

          {movie.description && (
            <p className="mt-6 max-w-2xl leading-7 text-gray-700">
              {movie.description}
            </p>
          )}

          {movie.releaseDate && (
            <p className="mt-4 text-sm">
              Release date:{" "}
              {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
          )}

          <Link
        href={`/movie/${movie.id}/shows`}
        className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
        >
        Book Now
        </Link>

        </div>
      </div>
    </main>
  );
}