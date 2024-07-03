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

  // Create the user
  const createdUser = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      status: "ACTIVE",
    },
    // Specify which fields to select in the returned user object
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

export const userServices = {
  createUser,
};
