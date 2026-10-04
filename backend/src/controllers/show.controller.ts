import { Request, Response } from "express";
import {
  getShows,
  createShow,
} from "../services/show.service";

export const getShowsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const shows = await getShows();

    res.json({
      success: true,
      data: shows,
    });
  } catch (error) {
    console.error("Failed to fetch shows:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shows",
    });
  }
};

export const createShowController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      movieId,
      screenId,
      startTime,
      endTime,
      price,
    } = req.body;

    if (
      !movieId ||
      !screenId ||
      !startTime ||
      !endTime ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "movieId, screenId, startTime, endTime and price are required",
      });
    }

    const show = await createShow({
      movieId: Number(movieId),
      screenId: Number(screenId),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      price: Number(price),
    });

    res.status(201).json({
      success: true,
      data: show,
    });
  } catch (error) {
    console.error("Failed to create show:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create show",
    });
  }
};
