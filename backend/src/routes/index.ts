import { Router } from "express";
import healthRoutes from "./health.routes";
import movieRoutes from "./movie.routes";
import cinemaRoutes from "./cinema.routes";
import screenRoutes from "./screen.routes";
import seatRoutes from "./seat.routes";
import showRoutes from "./show.routes";
import bookingRoutes from "./booking.routes";
import userRoutes from "./user.routes";
import bookingSeatRoutes from "./booking-seat.routes";
import authRoutes from "./auth.routes";
import paymentRoutes from "./payment.routes";

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
router.use("/bookings", bookingRoutes);
router.use("/users", userRoutes);
router.use("/bookings", bookingSeatRoutes);
router.use("/auth", authRoutes);
router.use("/payments", paymentRoutes);

export default router;