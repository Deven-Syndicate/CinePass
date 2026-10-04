import { Router } from "express";
import {
  getCinemasController,
  createCinemaController,
} from "../controllers/cinema.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../generated/prisma/client";

const router = Router();

router.get("/", getCinemasController);
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  createCinemaController
);

export default router;
