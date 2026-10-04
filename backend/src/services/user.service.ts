import { prisma } from "./prisma.service";

export const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createUser = async (data: {
  email: string;
  password: string;
  name: string;
  role?: "CUSTOMER" | "ADMIN" | "SCANNER";
}) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};