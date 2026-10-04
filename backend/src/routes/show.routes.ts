import { Router } from "express";
import {
  getShowsController,
  createShowController,
} from "../controllers/show.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../generated/prisma/client";

const router = Router();

router.get("/", getShowsController);
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  createShowController
);

export default router;