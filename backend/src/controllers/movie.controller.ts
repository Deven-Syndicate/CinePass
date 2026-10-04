import { Request, Response } from "express";
import {
  getMovies,
  createMovie,
} from "../services/movie.service";

export const getMoviesController = async (
  _req: Request,
  res: Response
) => {
  try {
    const movies = await getMovies();

    res.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error("Failed to fetch movies:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch movies",
    });
  }
};

export const createMovieController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      durationMin,
      language,
      genre,
    } = req.body;

    if (
      !title ||
      !durationMin ||
      !language ||
      !genre
    ) {
      return res.status(400).json({
        success: false,
        message: "title, durationMin, language and genre are required",
      });
    }

    if (durationMin <= 0) {
      return res.status(400).json({
        success: false,
        message: "durationMin must be greater than 0",
      });
    }

    const movie = await createMovie(req.body);

    res.status(201).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error("Failed to create movie:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create movie",
    });
  }
};