"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { passwordResetTokens } from "@/db/password-reset-token-schema";
import { users } from "@/db/user-schema";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

export const passwordReset = async (email: string) => {
  const session = await auth();

  if (!!session?.user?.id) {
    return {
      success: false,
      message: "You are already logged in",
    };
  }

  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, email));

  if (!user) return {};

  const passwordResetToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  await db
    .insert(passwordResetTokens)
    .values({
      userId: user.id,
      token: passwordResetToken,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: passwordResetTokens.userId,
      set: {
        token: passwordResetToken,
        expiresAt,
      },
    });

  return {
    success: true,
    message: "Password reset email sent",
  };
};
