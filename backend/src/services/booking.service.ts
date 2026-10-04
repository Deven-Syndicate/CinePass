import { prisma } from "./prisma.service";

export const getBookings = async () => {
  return prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      show: {
        include: {
          movie: true,
          screen: {
            include: {
              cinema: true,
            },
          },
        },
      },
      bookingSeats: {
        include: {
          seat: true,
        },
      },
      payment: true,
      ticket: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createBooking = async (data: {
  userId: number;
  showId: number;
  seatIds: number[];
}) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return prisma.$transaction(async (tx) => {
    const show = await tx.show.findUnique({
      where: { id: data.showId },
    });

    if (!show) {
      throw new Error("Show not found");
    }

    if (data.seatIds.length === 0) {
      throw new Error("At least one seat is required");
    }

    const seats = await tx.seat.findMany({
      where: {
        id: {
          in: data.seatIds,
        },
      },
    });

    if (seats.length !== data.seatIds.length) {
      throw new Error("One or more seats not found");
    }

    const invalidSeat = seats.find(
      (seat) => seat.screenId !== show.screenId
    );

    if (invalidSeat) {
      throw new Error("One or more seats do not belong to the show's screen");
    }

    const totalAmount = Number(show.price) * data.seatIds.length;

    const booking = await tx.booking.create({
      data: {
        userId: data.userId,
        showId: data.showId,
        totalAmount,
        expiresAt,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        show: {
          include: {
            movie: true,
            screen: {
              include: {
                cinema: true,
              },
            },
          },
        },
      },
    });

    await tx.bookingSeat.createMany({
      data: data.seatIds.map((seatId) => ({
        bookingId: booking.id,
        showId: data.showId,
        seatId,
      })),
    });

    return booking;
  });
};

export const expireBookings = async () => {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const expiredBookings = await tx.booking.findMany({
      where: {
        status: {
          in: ["PENDING", "PAYMENT_PENDING"],
        },
        expiresAt: {
          lt: now,
        },
      },
      select: {
        id: true,
      },
    });

    if (expiredBookings.length === 0) {
      return {
        count: 0,
      };
    }

    const bookingIds = expiredBookings.map((booking) => booking.id);

    await tx.bookingSeat.deleteMany({
      where: {
        bookingId: {
          in: bookingIds,
        },
      },
    });

    const result = await tx.booking.updateMany({
      where: {
        id: {
          in: bookingIds,
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    return result;
  });
};