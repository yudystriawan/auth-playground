import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(5, { message: "Password must be at least 5 characters" });

export const passwordConfirmationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
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

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(passwordConfirmationSchema);
