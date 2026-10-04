import { Router } from "express";
import { createTicketController } from "../controllers/ticket.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/:bookingId",
  authenticate,
  createTicketController
);

export default router;
