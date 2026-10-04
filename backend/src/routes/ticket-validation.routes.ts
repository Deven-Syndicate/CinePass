import { Router } from "express";
import { validateTicketController } from "../controllers/ticket-validation.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { UserRole } from "../generated/prisma/client";

const router = Router();

router.post(
  "/validate",
  authenticate,
  authorize(UserRole.SCANNER),
  validateTicketController
);

export default router;
