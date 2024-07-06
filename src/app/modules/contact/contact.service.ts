import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const postAContact = async (payload: any) => {
  const result = await prisma.helloContact.create({
    data: payload,
  });
  return result;
};

export const contactService = {
  postAContact,
};
