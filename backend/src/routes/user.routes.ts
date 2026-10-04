import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  getUsersController,
  createUserController,
} from "../controllers/user.controller";
import { UserRole } from "../generated/prisma/client";

const router = Router();

router.get("/", authenticate, getUsersController);
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  createUserController
);

export default router;