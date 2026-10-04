import { Router } from "express";
import {
  getSeatsController,
  getShowSeatsController,
  createSeatController,
} from "../controllers/seat.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../generated/prisma/client";

const router = Router();

router.get("/:showId", getShowSeatsController);
router.get("/", getSeatsController);
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  createSeatController
);

export default router;