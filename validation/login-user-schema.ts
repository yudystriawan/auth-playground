import { z } from "zod";
import { passwordSchema } from "./password-schema";

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});
