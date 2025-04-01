"use server";

import { signIn } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/user-schema";
import { loginUserSchema } from "@/validation/login-user-schema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";

export const loginWithCredentials = async (props: {
  email: string;
  password: string;
  otp?: string;
}) => {
  const validation = loginUserSchema.safeParse(props);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message ?? "Invalid data",
    };
  }

  try {
    const { email, password, otp } = props;

    await signIn("credentials", {
      email,
      password,
      otp,
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

export const preLoginCheck = async (props: {
  email: string;
  password: string;
}) => {
  const { email, password } = props;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const isMatch = await compare(password, user.password as string);
  if (!isMatch) {
    return {
      success: false,
      message: "Invalid credentials",
    };
  }

  return {
    success: true,
    message: "User found",
    twoFactorEnabled: user.twoFactorEnabled,
  };
};
