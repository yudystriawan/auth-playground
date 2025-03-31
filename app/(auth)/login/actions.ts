"use server";

import { signIn } from "@/auth";
import { loginUserSchema } from "@/validation/login-user-schema";

export const loginWithCredentials = async (props: {
  email: string;
  password: string;
}) => {
  const validation = loginUserSchema.safeParse(props);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message ?? "Invalid data",
    };
  }

  try {
    const { email, password } = validation.data;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (e: any) {
    console.error("Error logging in:", e);
    return {
      success: false,
      message: "Invalid credentials",
    };
  }
};
