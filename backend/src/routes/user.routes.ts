import { Router } from "express";
import {
  getUsersController,
  createUserController,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUsersController);
router.post("/", createUserController);

export default router;