import { z } from "zod";

const Species = z.enum(["DOG", "CAT", "BIRD"], {
  required_error: "Species is required",
});
const Size = z.enum(["SMALL", "MEDIUM", "LARGE"], {
  required_error: "Size is required",
});
const createPetValidationSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, { message: "Name cannot be empty" }),
  species: Species,
  breed: z
    .string({
      required_error: "Breed is required",
    })
    .min(1, { message: "Breed cannot be empty" }),
  age: z
    .number({
      required_error: "Age is required",
    })
    .int()
    .nonnegative({ message: "Age must be a non-negative integer" }),
  size: Size,
  location: z
    .string({
      required_error: "Location is required",
    })
    .min(1, { message: "Location cannot be empty" }),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(1, { message: "Description cannot be empty" }),
  temperament: z
    .string({
      required_error: "Temperament is required",
    })
    .min(1, { message: "Temperament cannot be empty" }),
  medicalHistory: z
    .string({
      required_error: "Medical history is required",
    })
    .min(1, { message: "Medical history cannot be empty" }),
  petPhoto: z
    .array(
      z.string().url({
        message: "Each pet photo must be a valid URL",
      })
    )
    .default([]),
  adoptionRequirements: z
    .string({
      required_error: "Adoption requirements are required",
    })
    .min(1, { message: "Adoption requirements cannot be empty" }),
});

export const petValidation = {
  createPetValidationSchema,
};
