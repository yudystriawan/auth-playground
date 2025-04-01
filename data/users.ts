import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/user-schema";
import { eq } from "drizzle-orm";
import "server-only";

export const getCurrentUser = async () => {
  const session = await auth();

  if (!session?.user) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(session.user.id!)));

  return user;
};
