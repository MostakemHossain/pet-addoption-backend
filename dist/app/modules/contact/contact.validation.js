"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactValidation = void 0;
const zod_1 = require("zod");
const postContactSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email address"),
        phone: zod_1.z.string({
            required_error: "Phone number is required",
        }),
        subject: zod_1.z.string({
            required_error: "Subject is required",
        }),
        message: zod_1.z.string({
            required_error: "Message is required",
        }),
    }),
});
exports.contactValidation = {
    postContactSchema,
};
