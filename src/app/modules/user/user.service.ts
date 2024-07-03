import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const createUser = async (req: any) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (existingUser) {
    throw new Error("This user already exists");
  }

  const createdUser = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      profilePhoto: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return createdUser;
};

const getAllUsers = async () => {
  const result = await prisma.user.findMany();
  return result;
};

export const userServices = {
  createUser,
  getAllUsers,
};
