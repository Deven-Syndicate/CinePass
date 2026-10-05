import { prisma } from "./prisma.service";
import {
  comparePassword,
  hashPassword,
} from "./password.service";
import { generateToken } from "./jwt.service";

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordValid = await comparePassword(
    password,
    user.password
  );

  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};