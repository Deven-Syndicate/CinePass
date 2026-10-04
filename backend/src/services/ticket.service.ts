import crypto from "crypto";
import QRCode from "qrcode";
import { prisma } from "./prisma.service";

export const createTicket = async (
    bookingId: number,
    userId: number
  ) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      ticket: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.userId !== userId) {
    throw new Error("Access denied");
  }

  if (booking.status !== "CONFIRMED") {
    throw new Error("Booking must be confirmed before creating a ticket");
  }

  if (booking.ticket) {
    throw new Error("Ticket already exists");
  }

  const qrToken = crypto.randomBytes(32).toString("hex");

  const ticket = await prisma.ticket.create({
    data: {
      bookingId,
      qrToken,
      status: "ACTIVE",
    },
  });

  const qrCode = await QRCode.toDataURL(qrToken);

  return {
    ...ticket,
    qrCode,
  };
};