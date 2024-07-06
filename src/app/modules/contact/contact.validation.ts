import { z } from "zod";

const postContactSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
    phone: z.string({
      required_error: "Phone number is required",
    }),
    subject: z.string({
      required_error: "Subject is required",
    }),
    message: z.string({
      required_error: "Message is required",
    }),
  }),
});

export const contactValidation = {
  postContactSchema,
};
