"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petValidation = void 0;
const zod_1 = require("zod");
const Species = zod_1.z.enum(["DOG", "CAT", "BIRD"], {
    required_error: "Species is required",
});
const Size = zod_1.z.enum(["SMALL", "MEDIUM", "LARGE"], {
    required_error: "Size is required",
});
const createPetValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: "Name is required",
    })
        .min(1, { message: "Name cannot be empty" }),
    species: Species,
    breed: zod_1.z
        .string({
        required_error: "Breed is required",
    })
        .min(1, { message: "Breed cannot be empty" }),
    age: zod_1.z
        .number({
        required_error: "Age is required",
    })
        .int()
        .nonnegative({ message: "Age must be a non-negative integer" }),
    size: Size,
    location: zod_1.z
        .string({
        required_error: "Location is required",
    })
        .min(1, { message: "Location cannot be empty" }),
    description: zod_1.z
        .string({
        required_error: "Description is required",
    })
        .min(1, { message: "Description cannot be empty" }),
    temperament: zod_1.z
        .string({
        required_error: "Temperament is required",
    })
        .min(1, { message: "Temperament cannot be empty" }),
    medicalHistory: zod_1.z
        .string({
        required_error: "Medical history is required",
    })
        .min(1, { message: "Medical history cannot be empty" }),
    petPhoto: zod_1.z
        .array(zod_1.z.string().url({
        message: "Each pet photo must be a valid URL",
    }))
        .default([]),
    adoptionRequirements: zod_1.z
        .string({
        required_error: "Adoption requirements are required",
    })
        .min(1, { message: "Adoption requirements cannot be empty" }),
});
const updateSpecies = zod_1.z
    .enum(["DOG", "CAT", "BIRD"], {
    required_error: "Species is required",
})
    .optional();
const updateSize = zod_1.z
    .enum(["SMALL", "MEDIUM", "LARGE"], {
    required_error: "Size is required",
})
    .optional();
const updatePetValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: "Name is required",
    })
        .min(1, { message: "Name cannot be empty" })
        .optional(),
    species: updateSpecies,
    breed: zod_1.z
        .string({
        required_error: "Breed is required",
    })
        .min(1, { message: "Breed cannot be empty" })
        .optional(),
    age: zod_1.z
        .number({
        required_error: "Age is required",
    })
        .int()
        .nonnegative({ message: "Age must be a non-negative integer" })
        .optional(),
    size: updateSize,
    location: zod_1.z
        .string({
        required_error: "Location is required",
    })
        .min(1, { message: "Location cannot be empty" })
        .optional(),
    description: zod_1.z
        .string({
        required_error: "Description is required",
    })
        .min(1, { message: "Description cannot be empty" })
        .optional(),
    temperament: zod_1.z
        .string({
        required_error: "Temperament is required",
    })
        .min(1, { message: "Temperament cannot be empty" })
        .optional(),
    medicalHistory: zod_1.z
        .string({
        required_error: "Medical history is required",
    })
        .min(1, { message: "Medical history cannot be empty" })
        .optional(),
    petPhoto: zod_1.z
        .array(zod_1.z.string().url({
        message: "Each pet photo must be a valid URL",
    }))
        .default([])
        .optional(),
    adoptionRequirements: zod_1.z
        .string({
        required_error: "Adoption requirements are required",
    })
        .min(1, { message: "Adoption requirements cannot be empty" })
        .optional(),
});
exports.petValidation = {
    createPetValidationSchema,
    updatePetValidationSchema,
};
