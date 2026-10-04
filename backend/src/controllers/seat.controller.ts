import { Request, Response } from "express";
import {
  getSeats,
  getShowSeats,
  createSeat,
} from "../services/seat.service";
import { Prisma } from "../generated/prisma/client";

export const getSeatsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const seats = await getSeats();

    res.json({
      success: true,
      data: seats,
    });
  } catch (error) {
    console.error("Failed to fetch seats:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch seats",
    });
  }
};

export const getShowSeatsController = async (
  req: Request,
  res: Response
) => {
  try {
    const showId = Number(req.params.showId);

    if (!Number.isInteger(showId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid show ID",
      });
    }

    const seats = await getShowSeats(showId);

    res.json({
      success: true,
      data: seats,
    });
  } catch (error) {
    console.error("Failed to fetch show seats:", error);

    if (error instanceof Error && error.message === "Show not found") {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch show seats",
    });
  }
};

export const createSeatController = async (
  req: Request,
  res: Response
) => {
  try {
    const { row, number, type, screenId } = req.body;

    const validSeatTypes = ["REGULAR", "PREMIUM", "RECLINER"];

    if (type && !validSeatTypes.includes(type)) {
        return res.status(400).json({
            success: false,
            message: "Invalid seat type",
        });
    }

    if (!row || !number || !screenId) {
      return res.status(400).json({
        success: false,
        message: "row, number and screenId are required",
      });
    }

    const seat = await createSeat({
      row,
      number: Number(number),
      type,
      screenId: Number(screenId),
    });

    res.status(201).json({
      success: true,
      data: seat,
    });
      } catch (error) {
      console.error("Failed to create seat:", error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(409).json({
          success: false,
          message: "Seat already exists on this screen",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to create seat",
      });
    }
};
