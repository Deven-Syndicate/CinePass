import { Router } from "express";
import {
  getBookingsController,
  createBookingController,
  expireBookingsController,
} from "../controllers/booking.controller";

const router = Router();

router.get("/", getBookingsController);
router.post("/", createBookingController);
router.post("/expire", expireBookingsController);

export default router;