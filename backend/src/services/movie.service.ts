import { prisma } from "./prisma.service";

export const getMovies = async () => {
  return prisma.movie.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createMovie = async (data: {
  title: string;
  description?: string;
  durationMin: number;
  language: string;
  genre: string;
  releaseDate?: Date;
  posterUrl?: string;
  trailerUrl?: string;
}) => {
  return prisma.movie.create({
    data,
  });
};