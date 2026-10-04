import { prisma } from "./prisma.service";

export const getShows = async () => {
  return prisma.show.findMany({
    include: {
      movie: true,
      screen: {
        include: {
          cinema: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export const createShow = async (data: {
  movieId: number;
  screenId: number;
  startTime: Date;
  endTime: Date;
  price: number;
}) => {
  return prisma.show.create({
    data,
    include: {
      movie: true,
      screen: {
        include: {
          cinema: true,
        },
      },
    },
  });
};