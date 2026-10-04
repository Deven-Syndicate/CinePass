import { prisma } from "./prisma.service";

export const getCinemas = async () => {
  return prisma.cinema.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createCinema = async (data: {
  name: string;
  address: string;
  city: string;
}) => {
  return prisma.cinema.create({
    data,
  });
};
