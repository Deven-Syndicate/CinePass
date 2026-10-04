import { Router } from "express";
import {
  getScreensController,
  createScreenController,
} from "../controllers/screen.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../generated/prisma/client";

const router = Router();

router.get("/", getScreensController);
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  createScreenController
);

export default router;