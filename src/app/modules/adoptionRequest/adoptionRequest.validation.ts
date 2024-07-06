import { z } from "zod";
const petStatusEnum = z.enum(["APPROVED", "PENDING", "REJECTED"]);

const postAdoptionRequestSchema = z.object({
  body: z.object({
    petId: z.string(),
    petOwnershipExperience: z.string(),
  }),
});
const updateAdoptionRequestSchema = z.object({
  body: z.object({
    status: petStatusEnum,
  }),
});

export const adoptionRequestValidation = {
  postAdoptionRequestSchema,
  updateAdoptionRequestSchema,
};
