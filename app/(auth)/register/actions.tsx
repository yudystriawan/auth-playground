"use server";

import db from "@/db/drizzle";
import { users } from "@/db/user-schema";
import { registerUserSchema } from "@/validation/register-user-schema";
import { hash } from "bcryptjs";

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
    const { email, password } = validation.data;
    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (e: any) {
    console.error("Error registering user:", e);
    let errorMessage = "An error occurred while registering the user";

    if (e.code === "23505") {
      errorMessage = "An account with this email already exists";
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};
