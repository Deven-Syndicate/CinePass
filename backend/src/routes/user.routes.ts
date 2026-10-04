import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  getUsersController,
  createUserController,
} from "../controllers/user.controller";

const router = Router();

router.get("/", authenticate, getUsersController);
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createUserController
);

export default router;