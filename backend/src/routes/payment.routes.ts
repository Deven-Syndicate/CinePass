import { Router } from "express";
import {
  createPaymentController,
  verifyPaymentController,
} from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/:bookingId",
  authenticate,
  createPaymentController
);

router.post(
  "/:paymentId/verify",
  authenticate,
  verifyPaymentController
);

export default router;
