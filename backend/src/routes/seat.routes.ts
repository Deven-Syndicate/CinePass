import { Router } from "express";
import {
  getSeatsController,
  createSeatController,
} from "../controllers/seat.controller";

const router = Router();

router.get("/", getSeatsController);
router.post("/", createSeatController);

export default router;