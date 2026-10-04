import { Router } from "express";
import {
  getBookingsController,
  createBookingController,
  expireBookingsController,
} from "../controllers/booking.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../generated/prisma/client";

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
router.post(
    "/expire",
    authenticate,
    authorize(UserRole.ADMIN),
    expireBookingsController
);

export default router;