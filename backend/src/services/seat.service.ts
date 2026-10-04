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

export const getShowSeats = async (showId: number) => {
  const show = await prisma.show.findUnique({
    where: {
      id: showId,
    },
  });

  if (!show) {
    throw new Error("Show not found");
  }

  const seats = await prisma.seat.findMany({
    where: {
      screenId: show.screenId,
    },
    include: {
      bookingSeats: {
        where: {
          showId,
        },
      },
    },
    orderBy: [
      {
        row: "asc",
      },
      {
        number: "asc",
      },
    ],
  });

  return seats.map((seat) => ({
    id: seat.id,
    row: seat.row,
    number: seat.number,
    type: seat.type,
    screenId: seat.screenId,
    available: seat.bookingSeats.length === 0,
  }));
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