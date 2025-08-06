import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import type { User } from "@/lib/types/db";

export const getUser = async (userId: string): Promise<User> => {
  "use server";
  const [user] = await db
    .select({
      id: usersTable.id,
      image: usersTable.image,
      name: usersTable.name,
      email: usersTable.email,
      displayName: usersTable.displayName,
      gender: usersTable.gender,
      intro: usersTable.intro,
      height: usersTable.height,
      weight: usersTable.weight,
      age: usersTable.age,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  return user;
};

export const getUsers = async (): Promise<User[]> => {
  "use server";
  const users = await db
    .select({
      id: usersTable.id,
      image: usersTable.image,
      name: usersTable.name,
      email: usersTable.email,
      displayName: usersTable.displayName,
      gender: usersTable.gender,
      intro: usersTable.intro,
      height: usersTable.height,
      weight: usersTable.weight,
      age: usersTable.age,
    })
    .from(usersTable);
  return users;
};

export const updateUser = async (
  userId: string,
  user: Partial<
    Pick<User, "displayName" | "gender" | "intro" | "height" | "weight" | "age">
  >,
) => {
  "use server";
  const [userToUpdate] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!userToUpdate) return false;

  await db
    .update(usersTable)
    .set({ ...user })
    .where(eq(usersTable.id, userId));
  return true;
};
