import { Request, Response } from "express";
import {
  createMockPayment,
  verifyMockPayment,
} from "../services/payment.service";

export const createPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    const bookingId = Number(req.params.bookingId);

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Valid bookingId is required",
      });
    }

    const payment = await createMockPayment(bookingId);

    return res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Failed to create payment:", error);

    if (error instanceof Error) {
      if (
        error.message === "Booking not found" ||
        error.message === "Booking is not available for payment" ||
        error.message === "Payment already exists for this booking"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create payment",
    });
  }
};

export const verifyPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    const paymentId = Number(req.params.paymentId);

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Valid paymentId is required",
      });
    }

    const payment = await verifyMockPayment(paymentId);

    return res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Failed to verify payment:", error);

    if (error instanceof Error) {
      if (
        error.message === "Payment not found" ||
        error.message === "Payment already verified" ||
        error.message ===
          "Booking is not available for payment verification"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};