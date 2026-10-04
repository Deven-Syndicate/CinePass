import { Router } from "express";
import {
  getMoviesController,
  createMovieController,
} from "../controllers/movie.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../generated/prisma/client";

const router = Router();

router.get("/", getMoviesController);
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  createMovieController
);

export default router;