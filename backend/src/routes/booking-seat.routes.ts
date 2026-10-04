import { Router } from "express";
import {
  getBookingSeatsController,
  addSeatToBookingController,
} from "../controllers/booking-seat.controller";

const router = Router();

router.get("/:bookingId/seats", getBookingSeatsController);
router.post("/:bookingId/seats", addSeatToBookingController);

export default router;
