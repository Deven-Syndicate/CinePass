import { Router } from "express";
import healthRoutes from "./health.routes";
import movieRoutes from "./movie.routes";
import cinemaRoutes from "./cinema.routes";
import screenRoutes from "./screen.routes";
import seatRoutes from "./seat.routes";
import showRoutes from "./show.routes";

const router = Router();


router.get("/", (_req, res) => {
  res.json({
    message: "CinePass API is running"
  });
});

router.use("/health", healthRoutes);
router.use("/movies", movieRoutes);
router.use("/cinemas", cinemaRoutes);
router.use("/screens", screenRoutes);
router.use("/seats", seatRoutes);
router.use("/shows", showRoutes);

export default router;