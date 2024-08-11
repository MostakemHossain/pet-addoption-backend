import {
  AdoptionRequest,
  Prisma,
  PrismaClient,
  petStatus,
} from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { TPagination } from "../../interfaces/pagination";
import { adoptionRequestSearchAbleFields } from "./adoptionRequest.constant";
import { IAdoptionRequestFilterRequest } from "./adoptionRequest.interface";

const prisma = new PrismaClient();

const postAdoptionRequest = async (user: any, payload: AdoptionRequest) => {
  const result = await prisma.adoptionRequest.create({
    data: {
      ...payload,
      userId: user.id,
    },
  });
  return result;
};

const getMyAdoptionRequest = async (
  user: any,
  params: IAdoptionRequestFilterRequest,
  options: TPagination
) => {
  const { limit, sortBy, page, sortOrder, skip } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.AdoptionRequestWhereInput[] = [];

  // Ensure userId condition
  andConditions.push({
    userId: user.id,
  });
  console.log(searchTerm);

  if (searchTerm) {
    andConditions.push({
      OR: adoptionRequestSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (key === "status") {
          return {
            [key]: {
              equals: petStatus[filterData[key] as keyof typeof petStatus],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.AdoptionRequestWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.adoptionRequest.findMany({
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

  const total = await prisma.adoptionRequest.count({
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

const approvedAdoptionRequest = async (
  payload: Partial<AdoptionRequest>,
  id: string
) => {
  
  const result = await prisma.adoptionRequest.update({
    where: {
      id,
    },
    data: {status: payload.status},
  });
  return result;
};

const allAdoptionRequest = async (
  params: IAdoptionRequestFilterRequest,
  options: TPagination
) => {
  const { limit, sortBy, page, sortOrder, skip } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.AdoptionRequestWhereInput[] = [];

  console.log(searchTerm);

  if (searchTerm) {
    andConditions.push({
      OR: adoptionRequestSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (key === "status") {
          return {
            [key]: {
              equals: petStatus[filterData[key] as keyof typeof petStatus],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.AdoptionRequestWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.adoptionRequest.findMany({
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

  const total = await prisma.adoptionRequest.count({
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

export const adoptionRequestService = {
  postAdoptionRequest,
  getMyAdoptionRequest,
  approvedAdoptionRequest,
  allAdoptionRequest,
};
