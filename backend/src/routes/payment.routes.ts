import { Router } from "express";
import {
  createPaymentController,
  verifyPaymentController,
} from "../controllers/payment.controller";

const router = Router();

router.post(
  "/:bookingId",
  createPaymentController
);

router.post(
  "/:paymentId/verify",
  verifyPaymentController
);

export default router;
