import { Router } from "express";
import {
  getScreensController,
  createScreenController,
} from "../controllers/screen.controller";

const router = Router();

router.get("/", getScreensController);
router.post("/", createScreenController);

export default router;