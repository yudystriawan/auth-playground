"use server";

import db from "@/db/drizzle";
import { passwordResetTokens } from "@/db/password-reset-token-schema";
import { users } from "@/db/user-schema";
import { passwordConfirmationSchema } from "@/validation/password-schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export const validateTokenResetPassword = async (
  token: string
): Promise<boolean> => {
  const [passwordResetToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token));

  if (!passwordResetToken) return false;

  const tokenMatch = passwordResetToken.token === token;
  if (!tokenMatch) return false;

  const now = Date.now();
  const isExpired = passwordResetToken.expiresAt!.getTime()! < now;

  if (isExpired) return false;

  return true;
};

export const updatePassword = async (props: {
  password: string;
  confirmPassword: string;
  token: string;
}) => {
  const { password, confirmPassword, token } = props;

  const validation = passwordConfirmationSchema.safeParse({
    password,
    confirmPassword,
  });
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message ?? "Invalid data",
    };
  }

  try {
    const isValidToken = await validateTokenResetPassword(props.token);
    if (!isValidToken) {
      return {
        success: false,
        message: "Invalid or expired token",
      };
    }

    const hashedPassword = await hash(password, 10);

    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, passwordResetToken.userId!));

    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, passwordResetToken.id));

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      message: "Failed to update password",
    };
  }
};
