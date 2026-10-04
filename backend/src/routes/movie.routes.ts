import { Router } from "express";
import {
  getMoviesController,
  createMovieController,
} from "../controllers/movie.controller";

const router = Router();

router.get("/", getMoviesController);
router.post("/", createMovieController);

export default router;