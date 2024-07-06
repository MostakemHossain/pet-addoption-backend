import { AdoptionRequest, PrismaClient } from "@prisma/client";

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

export const adoptionRequestService = {
  postAdoptionRequest,
};
