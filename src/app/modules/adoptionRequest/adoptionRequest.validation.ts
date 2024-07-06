import { z } from "zod";

const postAdoptionRequestSchema = z.object({
  body: z.object({
    petId: z.string(),
    petOwnershipExperience: z.string(),
  }),
});

export const adoptionRequestValidation = {
  postAdoptionRequestSchema,
};
