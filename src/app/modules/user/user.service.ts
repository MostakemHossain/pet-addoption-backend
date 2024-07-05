import { Prisma, PrismaClient } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { TPagination } from "../../interfaces/pagination";
import bcrypt from "bcrypt"
import { fileUploader } from "../../../shared/fileUpload";
import { userSearchAbleFields, userSelectedFields } from "./user.constant";
import { IUserFilterRequest } from "./user.interface";
import config from "../../../config";

const prisma = new PrismaClient();

const createUser = async (req: any) => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const userExists = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.bcrypt_salt_rounds)
  );

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
      profilePhoto: req.body.profilePhoto,
      status: "ACTIVE",
    },
    select: userSelectedFields,
  });

  return createdUser;
};

const getAllUsers = async (
  params: IUserFilterRequest,
  options: TPagination
) => {
  const { limit, sortBy, page, sortOrder, skip } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];
  andConditions.push({
    isDeleted: false,
  });
  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: userSelectedFields,
  });
  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleUser = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    select: userSelectedFields,
  });
  return result;
};
const deleteAUser = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
    select: userSelectedFields,
  });
  return result;
};

export const userServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteAUser,
};
