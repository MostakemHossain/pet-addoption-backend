import { Prisma, PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../../config";
import AppError from "../../../errors/AppError";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { fileUploader } from "../../../shared/fileUpload";
import { TPagination } from "../../interfaces/pagination";
import { userSearchAbleFields, userSelectedFields } from "./user.constant";
import { CustomRequest } from "./user.controller";
import { IUserFilterRequest } from "./user.interface";

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
    throw new AppError(httpStatus.BAD_REQUEST, "This user already exists");
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
const updateMyProfile = async (user: any, req: CustomRequest) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
      status: user.ACTIVE,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!");
  }

  const file = req.file;

  if (file) {
    const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
    if (uploadedProfileImage && uploadedProfileImage.secure_url) {
      req.body.profilePhoto = uploadedProfileImage.secure_url;
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Profile image upload failed!"
      );
    }
  }
  const result = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      email: req?.body?.email,
      name: req?.body?.name,
      profilePhoto: req?.body?.profilePhoto,
    },
  });
  return result;
};

const updateUserRoleStatus = async (userId: string, payload: any) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
  });
  return result;
};

const getMyProfile = async (user: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: userSelectedFields,
  });
  return userData;
};

const updateRole = async (payload: Partial<User>, id: string, user: any) => {
  if (user.role === "SUPER_ADMIN") {
    return prisma.user.update({
      where: { id },
      data: payload,
    });
  } else if (user.role === "ADMIN") {
    if (payload.role === "SUPER_ADMIN") {
      throw new Error(`Admin cannot change role to super_admin.`);
    } else {
      return prisma.user.update({
        where: { id },
        data: payload,
      });
    }
  } else {
    throw new Error(`User does not have permission to update roles.`);
  }
};
export const userServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteAUser,
  updateMyProfile,
  updateUserRoleStatus,
  getMyProfile,
  updateRole,
};
