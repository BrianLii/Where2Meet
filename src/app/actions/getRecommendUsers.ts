import { eq, not } from "drizzle-orm";

import { db } from "@/db";
import {
  users as usersTable,
  userLikesTable,
  userDislikesTable,
} from "@/db/schema";
import type { UserShow } from "@/lib/types/db";

const getRecommendUsers = async (userId: string): Promise<UserShow[]> => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        displayName: usersTable.displayName,
        gender: usersTable.gender,
        intro: usersTable.intro,
        height: usersTable.height,
        weight: usersTable.weight,
        age: usersTable.age,
        image: usersTable.image,
      })
      .from(usersTable)
      .where(not(eq(usersTable.id, userId)))
      .execute();
    const likeUsers = await db
      .select({
        id: userLikesTable.likedId,
        displayName: usersTable.displayName,
        name: usersTable.name,
        email: usersTable.email,
        gender: usersTable.gender,
        intro: usersTable.intro,
        height: usersTable.height,
        weight: usersTable.weight,
        age: usersTable.age,
        image: usersTable.image,
      })
      .from(userLikesTable)
      .innerJoin(usersTable, eq(usersTable.id, userLikesTable.likedId))
      .where(eq(userLikesTable.likerId, userId))
      .execute();
    const dislikeUsers = await db
      .select({
        id: userDislikesTable.dislikedId,
        displayName: usersTable.displayName,
        name: usersTable.name,
        email: usersTable.email,
        gender: usersTable.gender,
        intro: usersTable.intro,
        height: usersTable.height,
        weight: usersTable.weight,
        age: usersTable.age,
        image: usersTable.image,
      })
      .from(userDislikesTable)
      .innerJoin(usersTable, eq(usersTable.id, userDislikesTable.dislikedId))
      .where(eq(userDislikesTable.dislikerId, userId))
      .execute();

    const likeUserIds = likeUsers.map((user) => user.id);
    const dislikeUserIds = dislikeUsers.map((user) => user.id);
    const filteredUsers = users.filter(
      (user) =>
        !likeUserIds.includes(user.id) && !dislikeUserIds.includes(user.id),
    );

    return filteredUsers as UserShow[];
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    return [];
  }
};
export default getRecommendUsers;
