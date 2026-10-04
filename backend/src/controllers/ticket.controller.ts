import { Request, Response } from "express";
import { createTicket } from "../services/ticket.service";

export const createTicketController = async (
  req: Request,
  res: Response
) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const userId = req.user?.userId;

    if (!bookingId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Valid bookingId is required",
      });
    }

    const ticket = await createTicket(
      bookingId,
      Number(userId)
    );

    return res.status(201).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Failed to create ticket:", error);

    if (error instanceof Error) {
      if (
        error.message === "Booking not found" ||
        error.message ===
          "Booking must be confirmed before creating a ticket" ||
        error.message === "Ticket already exists"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (error.message === "Access denied") {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create ticket",
    });
  }
};