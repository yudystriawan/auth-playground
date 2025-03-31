"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/user-schema";
import { changePasswordSchema } from "@/validation/password-schema";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const changePassword = async (
  data: z.infer<typeof changePasswordSchema>
) => {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const validation = changePasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message ?? "Invalid data",
    };
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(session.user.id)));
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const { currentPassword, password } = data;
    const isPasswordMatch = await compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Current password is incorrect",
      };
    }

    const hashedPassword = await hash(password, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, parseInt(session.user.id)));

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
