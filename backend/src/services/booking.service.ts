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
  expiresAt?: Date;
}) => {
  return prisma.booking.create({
    data,
    include: {
      user: true,
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