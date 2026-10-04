import { Request, Response } from "express";
import { validateTicket } from "../services/ticket-validation.service";

export const validateTicketController = async (
  req: Request,
  res: Response
) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken || typeof qrToken !== "string") {
      return res.status(400).json({
        success: false,
        message: "qrToken is required",
      });
    }

    const result = await validateTicket(qrToken);

    return res.json({
      success: true,
      message: "Ticket validated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Ticket validation failed:", error);

    if (error instanceof Error) {
      if (
        error.message === "Invalid ticket" ||
        error.message === "Ticket is not active" ||
        error.message === "Booking is not confirmed"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to validate ticket",
    });
  }
};
