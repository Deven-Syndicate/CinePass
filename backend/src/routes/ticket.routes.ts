import { Router } from "express";
import { createTicketController } from "../controllers/ticket.controller";

const router = Router();

router.post(
  "/:bookingId",
  createTicketController
);

export default router;
