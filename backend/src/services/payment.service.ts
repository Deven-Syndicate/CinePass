import { prisma } from "./prisma.service";

export const createMockPayment = async (
    bookingId: number,
    userId: number
  ) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.userId !== userId) {
    throw new Error("Access denied");
  }

  if (booking.status !== "PENDING") {
    throw new Error("Booking is not available for payment");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment) {
    throw new Error("Payment already exists for this booking");
  }

  const razorpayOrderId = `mock_order_${Date.now()}_${bookingId}`;

  return prisma.payment.create({
    data: {
      bookingId,
      razorpayOrderId,
      amount: booking.totalAmount,
      status: "CREATED",
    },
  });
};

export const verifyMockPayment = async (
    paymentId: number,
    userId: number
  ) => {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.booking.userId !== userId) {
      throw new Error("Access denied");
    }

    if (payment.status === "SUCCESS") {
      throw new Error("Payment already verified");
    }

    if (payment.booking.status !== "PENDING") {
      throw new Error("Booking is not available for payment verification");
    }

    const mockPaymentId = `mock_payment_${Date.now()}_${payment.id}`;

    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: mockPaymentId,
        status: "SUCCESS",
      },
    });

    await tx.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: "CONFIRMED",
        expiresAt: null,
      },
    });

    return updatedPayment;
  });
};