import { Router } from "express";
import {
  getShowsController,
  createShowController,
} from "../controllers/show.controller";

const router = Router();

router.get("/", getShowsController);
router.post("/", createShowController);

export default router;