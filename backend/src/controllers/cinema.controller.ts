import { Request, Response } from "express";
import {
  getCinemas,
  createCinema,
} from "../services/cinema.service";

export const getCinemasController = async (
  _req: Request,
  res: Response
) => {
  try {
    const cinemas = await getCinemas();

    res.json({
      success: true,
      data: cinemas,
    });
  } catch (error) {
    console.error("Failed to fetch cinemas:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cinemas",
    });
  }
};

export const createCinemaController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, address, city } = req.body;

    if (!name || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "name, address and city are required",
      });
    }

    const cinema = await createCinema(req.body);

    res.status(201).json({
      success: true,
      data: cinema,
    });
  } catch (error) {
    console.error("Failed to create cinema:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create cinema",
    });
  }
};