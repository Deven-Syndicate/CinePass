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
      userId,
      showId,
      totalAmount,
    } = req.body;

    if (
      !userId ||
      !showId ||
      totalAmount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "userId, showId and totalAmount are required",
      });
    }

    const booking = await createBooking({
      userId: Number(userId),
      showId: Number(showId),
      totalAmount: Number(totalAmount),
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Failed to create booking:", error);

    res.status(500).json({
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