import { Prisma, PrismaClient } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { TPagination } from "../../interfaces/pagination";
import { contactSearchAbleFields } from "./contact.constant";
import { IContactFilterRequest } from "./contact.interface";

const prisma = new PrismaClient();

const postAContact = async (payload: any) => {
  const result = await prisma.helloContact.create({
    data: payload,
  });
  return result;
};
const getAllContact = async (
  params: IContactFilterRequest,
  options: TPagination
) => {
  const { limit, sortBy, page, sortOrder, skip } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.HelloContactWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: contactSearchAbleFields.map((field) => ({
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

  const whereConditions: Prisma.HelloContactWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.helloContact.findMany({
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
  const total = await prisma.helloContact.count({
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

const deleteAContact = async (id: string) => {
  const result = await prisma.helloContact.delete({
    where: {
      id,
    },
  });
  return result;
};

export const contactService = {
  postAContact,
  getAllContact,
  deleteAContact,
};
