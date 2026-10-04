import { prisma } from "./prisma.service";

export const addSeatToBooking = async (data: {
  bookingId: number;
  seatId: number;
}) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: data.bookingId,
    },
    include: {
      show: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  const seat = await prisma.seat.findUnique({
    where: {
      id: data.seatId,
    },
  });

  if (!seat) {
    throw new Error("Seat not found");
  }

  if (seat.screenId !== booking.show.screenId) {
    throw new Error("Seat does not belong to the show's screen");
  }

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