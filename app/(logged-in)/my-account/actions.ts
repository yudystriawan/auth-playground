"use server";

import { auth } from "@/auth";
import { getCurrentUser } from "@/data/users";
import db from "@/db/drizzle";
import { users } from "@/db/user-schema";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";

export const generate2faSecret = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  try {
    let twoFactorSecret = user.twoFactorSecret;
    if (!twoFactorSecret) {
      twoFactorSecret = authenticator.generateSecret();

      await db
        .update(users)
        .set({
          twoFactorSecret: twoFactorSecret,
        })
        .where(eq(users.id, user.id));
    }

    return {
      success: true,
      secret: authenticator.keyuri(
        user.email,
        "Auth Playground",
        twoFactorSecret
      ),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error generating 2FA secret",
    };
  }
};

export const enable2fa = async (props: { otp: string }) => {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const { otp } = props;

  if (!user.twoFactorSecret) {
    return {
      success: false,
      message: "2FA is not enabled",
    };
  }

  const isValid = authenticator.check(otp, user.twoFactorSecret);
  if (!isValid) {
    return {
      success: false,
      message: "Invalid OTP",
    };
  }

  await db
    .update(users)
    .set({
      twoFactorEnabled: true,
    })
    .where(eq(users.id, user.id));

  return {
    success: true,
    message: "2FA activated successfully",
  };
};

export const disable2fa = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  await db
    .update(users)
    .set({
      twoFactorEnabled: false,
    })
    .where(eq(users.id, user.id));

  return {
    success: true,
    message: "2FA disabled successfully",
  };
};
