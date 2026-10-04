import { Request, Response } from "express";
import {
  getUsers,
  createUser,
} from "../services/user.service";
import { Prisma } from "../generated/prisma/client";

export const getUsersController = async (
  _req: Request,
  res: Response
) => {
  try {
    const users = await getUsers();

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const createUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "email, password and name are required",
      });
    }

    const validRoles = ["CUSTOMER", "ADMIN", "SCANNER"];

    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const user = await createUser({
      email,
      password,
      name,
      role,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
    } catch (error) {
    console.error("Failed to create user:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};