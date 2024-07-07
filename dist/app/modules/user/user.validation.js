"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
    }),
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email("Invalid email address"),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(6, "Password must be at least 6 characters long")
        .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
        .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
        .regex(/(?=.*[0-9])/, "Password must contain at least one number")
        .regex(/(?=.*[!@#$%^&*])/, "Password must contain at least one special character"),
});
const updateUserValidationSchema = zod_1.z.object({
    name: zod_1.z.string({}).optional(),
    email: zod_1.z.string().email({}).optional(),
});
exports.userValidation = {
    createUserValidationSchema,
    updateUserValidationSchema,
};
