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
  totalAmount: number;
}) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return prisma.booking.create({
    data: {
      userId: data.userId,
      showId: data.showId,
      totalAmount: data.totalAmount,
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
};

export const expireBookings = async () => {
  return prisma.booking.updateMany({
    where: {
      status: {
        in: ["PENDING", "PAYMENT_PENDING"],
      },
      expiresAt: {
        lt: new Date(),
      },
    },
    data: {
      status: "EXPIRED",
    },
  });
};