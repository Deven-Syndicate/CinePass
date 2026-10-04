import { prisma } from "./prisma.service";

export const getScreens = async () => {
  return prisma.screen.findMany({
    include: {
      cinema: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createScreen = async (data: {
  name: string;
  cinemaId: number;
}) => {
  return prisma.screen.create({
    data,
    include: {
      cinema: true,
    },
  });
};