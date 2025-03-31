import { z } from "zod";
import { passwordSchema } from "./password-schema";

export const registerUserSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    // Check if password and confirmPassword match
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
