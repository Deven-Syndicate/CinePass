import { Request, Response } from "express";
import {
  getBookings,
  createBooking,
  expireBookings,
} from "../services/booking.service";

export const getBookingsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const bookings = await getBookings();

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const createBookingController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      showId,
      seatIds,
    } = req.body;

const userId = req.user?.userId;

    if (
      !userId ||
      !showId ||
      !Array.isArray(seatIds) ||
      seatIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "userId, showId and seatIds are required",
      });
    }

    const booking = await createBooking({
      userId: Number(userId),
      showId: Number(showId),
      seatIds: seatIds.map(Number),
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Failed to create booking:", error);

    if (error instanceof Error) {
      if (
        error.message === "Show not found" ||
        error.message === "At least one seat is required" ||
        error.message === "One or more seats not found" ||
        error.message ===
          "One or more seats do not belong to the show's screen"
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

export const expireBookingsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const result = await expireBookings();

    res.json({
      success: true,
      data: {
        expiredCount: result.count,
      },
    });
  } catch (error) {
    console.error("Failed to expire bookings:", error);

    res.status(500).json({
      success: false,
      message: "Failed to expire bookings",
    });
  }
};