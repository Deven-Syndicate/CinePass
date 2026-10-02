import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "CinePass API is running"
  });
});

export default router;