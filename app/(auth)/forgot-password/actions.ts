"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { passwordResetTokens } from "@/db/password-reset-token-schema";
import { users } from "@/db/user-schema";
import { mailer } from "@/lib/email";
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

  try {
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

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/update-password?token=${passwordResetToken}`;
    await mailer.sendMail({
      from: "MS_sKS0QI@trial-3m5jgro7y90gdpyo.mlsender.net",
      subject: "Password Reset",
      to: email,
      html: `
        <div>
          <p>Hi, ${email}! You requested to reset your password</p>
          <p>Click the link below to reset your password. This link will expire in 1 hour</p>
          <a href="${resetLink}">${resetLink}</a>
        </div>
      `,
    });
    return {
      success: true,
      message: "Password reset email sent",
    };
  } catch (error) {
    console.error("Error sending password reset email", error);
    return {
      success: false,
      message: "Error sending password reset email",
    };
  }
};
