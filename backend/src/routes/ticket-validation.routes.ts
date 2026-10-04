import { Router } from "express";
import { validateTicketController } from "../controllers/ticket-validation.controller";

const router = Router();

router.post(
  "/validate",
  validateTicketController
);

export default router;
