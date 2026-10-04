import { Router } from "express";
import {
  getBookingsController,
  createBookingController,
  expireBookingsController,
} from "../controllers/booking.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  getBookingsController
);
router.post(
  "/",
  authenticate,
  createBookingController
);
router.post("/expire", expireBookingsController);

export default router;