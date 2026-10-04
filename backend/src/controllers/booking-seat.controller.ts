import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import {
  addSeatToBooking,
  getBookingSeats,
} from "../services/booking-seat.service";

export const getBookingSeatsController = async (
  req: Request,
  res: Response
) => {
  try {
    const bookingId = Number(req.params.bookingId);

    const bookingSeats = await getBookingSeats(bookingId);

    res.json({
      success: true,
      data: bookingSeats,
    });
  } catch (error) {
    console.error("Failed to fetch booking seats:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking seats",
    });
  }
};

export const addSeatToBookingController = async (
  req: Request,
  res: Response
) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const { seatId } = req.body;

    if (!seatId) {
      return res.status(400).json({
        success: false,
        message: "seatId is required",
      });
    }

    const bookingSeat = await addSeatToBooking({
      bookingId,
      seatId: Number(seatId),
    });

    res.status(201).json({
      success: true,
      data: bookingSeat,
    });
    } catch (error) {
    console.error("Failed to add seat to booking:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "Seat is already added to this booking",
      });
    }

    if (error instanceof Error) {
      if (
        error.message === "Booking not found" ||
        error.message === "Seat not found" ||
        error.message === "Seat does not belong to the show's screen"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add seat to booking",
    });
  }
};
