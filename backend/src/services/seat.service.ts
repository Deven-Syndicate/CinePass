import { prisma } from "./prisma.service";

export const getSeats = async () => {
  return prisma.seat.findMany({
    include: {
      screen: true,
    },
    orderBy: [
      {
        screenId: "asc",
      },
      {
        row: "asc",
      },
      {
        number: "asc",
      },
    ],
  });
};

export const createSeat = async (data: {
  row: string;
  number: number;
  type?: "REGULAR" | "PREMIUM" | "RECLINER";
  screenId: number;
}) => {
  return prisma.seat.create({
    data,
    include: {
      screen: true,
    },
  });
};