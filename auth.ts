import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
