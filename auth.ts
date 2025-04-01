import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticator } from "otplib";
import db from "./db/drizzle";
import { users } from "./db/user-schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.id = user.id;

      return token;
    },
    session: async ({ session, token }) => {
      if (token) session.user.id = token.id as string;

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        otp: {},
      },
      authorize: async (credentials) => {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials?.email as string));
        if (!user) throw new Error("Incorrect credentials");

        const isMatch = await compare(
          credentials?.password as string,
          user.password as string
        );
        if (!isMatch) throw new Error("Incorrect credentials");

        if (user.twoFactorEnabled) {
          const otpValid = authenticator.check(
            credentials.otp as string,
            user.twoFactorSecret as string
          );

          if (!otpValid) {
            throw new Error("Invalid OTP");
          }
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
