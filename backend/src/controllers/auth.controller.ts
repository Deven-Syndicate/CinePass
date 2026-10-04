import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const result = await loginUser(email, password);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Login failed:", error);

    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};