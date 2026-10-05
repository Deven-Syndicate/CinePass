import { Request, Response } from "express";
import {
  loginUser,
  registerUser,
} from "../services/auth.service";

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

export const registerController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const result = await registerUser(
      name,
      email,
      password
    );

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Registration failed:", error);

    if (
      error instanceof Error &&
      error.message === "Email already registered"
    ) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};