import { prisma } from "./prisma.service";

export const addSeatToBooking = async (data: {
  bookingId: number;
  seatId: number;
}) => {
  return prisma.bookingSeat.create({
    data,
    include: {
      booking: true,
      seat: true,
    },
  });
};

export const getBookingSeats = async (bookingId: number) => {
  return prisma.bookingSeat.findMany({
    where: {
      bookingId,
    },
    include: {
      seat: true,
    },
    orderBy: {
      seat: {
        row: "asc",
      },
    },
  });
};