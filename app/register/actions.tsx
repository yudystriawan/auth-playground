"use server";

import { registerUserSchema } from "@/validation/register-user-schema";

export const registerUser = async (props: {
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const validation = registerUserSchema.safeParse(props);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message ?? "Invalid data",
    };
  }

  try {
    return {};
  } catch (e) {
    console.error("Error registering user:", e);
    return {
      success: false,
      message: "An error occurred while registering the user",
    };
  }
};
