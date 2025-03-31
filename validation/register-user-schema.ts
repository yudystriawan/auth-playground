import { z } from "zod";
import { passwordConfirmationSchema } from "./password-schema";

export const registerUserSchema = z
  .object({
    email: z.string().email(),
  })
  .and(passwordConfirmationSchema);
