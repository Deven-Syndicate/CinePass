import { Router } from "express";
import {
  getCinemasController,
  createCinemaController,
} from "../controllers/cinema.controller";

const router = Router();

router.get("/", getCinemasController);
router.post("/", createCinemaController);

export default router;
