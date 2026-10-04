import { prisma } from "./prisma.service";

export const validateTicket = async (qrToken: string) => {
  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { qrToken },
      include: {
        booking: {
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
        },
      },
    });

    if (!ticket) {
      throw new Error("Invalid ticket");
    }

    if (ticket.status !== "ACTIVE") {
      throw new Error("Ticket is not active");
    }

    if (ticket.booking.status !== "CONFIRMED") {
      throw new Error("Booking is not confirmed");
    }

    const updatedTicket = await tx.ticket.update({
      where: { id: ticket.id },
      data: {
        status: "USED",
        usedAt: new Date(),
      },
    });

    return {
      ticket: updatedTicket,
      booking: ticket.booking,
    };
  });
};