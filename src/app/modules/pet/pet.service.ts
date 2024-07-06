import { Prisma, PrismaClient } from "@prisma/client";
import { Request } from "express";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { fileUploader } from "../../../shared/fileUpload";
import { TPagination } from "../../interfaces/pagination";

import { petSearchAbleFields } from "./pet.constant";
import { IPetFilterRequest } from "./pet.interface";
const prisma = new PrismaClient();

const addAPet = async (user: any, req: Request) => {
  const files = req.files as Express.Multer.File[];

  let petPhotos: string[] = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map((file) =>
      fileUploader.uploadToCloudinary(file)
    );
    const uploadResults = await Promise.all(uploadPromises);

    petPhotos = uploadResults
      .filter((result) => !!result)
      .map((result) => result!.secure_url);
  }
  req.body.userId = user.id;
  const result = await prisma.pet.create({
    data: {
      ...req.body,
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed,
      age: req.body.age,
      size: req.body.size,
      location: req.body.location,
      description: req.body.description,
      temperament: req.body.temperament,
      medicalHistory: req.body.medicalHistory,
      adoptionRequirements: req.body.adoptionRequirements,
      petPhoto: petPhotos,
    },
  });

  return result;
};

const getAllPet = async (params: IPetFilterRequest, options: TPagination) => {
  const { limit, sortBy, page, sortOrder, skip } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.PetWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: petSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        // Ensure that the type of the value matches the expected type
        let value = (filterData as any)[key];
        if (key === "age") {
          value = parseInt(value, 10);
        }
        return {
          [key]: {
            equals: value,
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.PetWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.pet.findMany({
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
  });

  const total = await prisma.pet.count({
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

const getMyAddPetPosts = async (
  params: IPetFilterRequest,
  options: TPagination,
  user: any
) => {
  const { limit, sortBy, page, sortOrder, skip } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.PetWhereInput[] = [];
  andConditions.push({
    // @ts-ignore
    userId: user.id,
  });

  if (searchTerm) {
    andConditions.push({
      OR: petSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        let value = (filterData as any)[key];
        if (key === "age") {
          value = parseInt(value, 10);
        }
        return {
          [key]: {
            equals: value,
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.PetWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.pet.findMany({
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
  });

  const total = await prisma.pet.count({
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

export const petService = {
  addAPet,
  getAllPet,
  getMyAddPetPosts,
};
