import { Router } from "express";
import {
  getBookingsController,
  createBookingController,
} from "../controllers/booking.controller";

const router = Router();

router.get("/", getBookingsController);
router.post("/", createBookingController);

export default router;