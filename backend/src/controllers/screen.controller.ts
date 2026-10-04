import { Request, Response } from "express";
import {
  getScreens,
  createScreen,
} from "../services/screen.service";

export const getScreensController = async (
  _req: Request,
  res: Response
) => {
  try {
    const screens = await getScreens();

    res.json({
      success: true,
      data: screens,
    });
  } catch (error) {
    console.error("Failed to fetch screens:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch screens",
    });
  }
};

export const createScreenController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, cinemaId } = req.body;

    if (!name || !cinemaId) {
      return res.status(400).json({
        success: false,
        message: "name and cinemaId are required",
      });
    }

    const screen = await createScreen({
      name,
      cinemaId: Number(cinemaId),
    });

    res.status(201).json({
      success: true,
      data: screen,
    });
  } catch (error) {
    console.error("Failed to create screen:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create screen",
    });
  }
};