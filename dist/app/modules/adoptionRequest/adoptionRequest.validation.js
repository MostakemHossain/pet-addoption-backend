"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adoptionRequestValidation = void 0;
const zod_1 = require("zod");
const petStatusEnum = zod_1.z.enum(["APPROVED", "PENDING", "REJECTED"]);
const postAdoptionRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        petId: zod_1.z.string(),
        petOwnershipExperience: zod_1.z.string(),
    }),
});
const updateAdoptionRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: petStatusEnum,
    }),
});
exports.adoptionRequestValidation = {
    postAdoptionRequestSchema,
    updateAdoptionRequestSchema,
};
