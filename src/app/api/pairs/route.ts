import { NextResponse, type NextRequest } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, userLikesTable } from "@/db/schema";
import type { UserShow } from "@/lib/types/db";

export async function GET(request: NextRequest) {
  const userId = new URL(request.nextUrl).searchParams.get("userId");

  if (!userId || userId.length < 1) {
    console.error("Invalid request");
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const likedByUser = await db
      .select({ likedId: userLikesTable.likedId })
      .from(userLikesTable)
      .where(eq(userLikesTable.likerId, userId))
      .execute();

    const likedByOther = await db
      .select({ likerId: userLikesTable.likerId })
      .from(userLikesTable)
      .where(eq(userLikesTable.likedId, userId))
      .execute();

    const mutuallikedByUser = likedByUser.map((user) => user.likedId);
    const mutuallikedByOther = likedByOther.map((user) => user.likerId);
    const mutualLikes = mutuallikedByUser.filter((id) =>
      mutuallikedByOther.includes(id),
    );

    if (mutualLikes.length > 0) {
      const pairUsers = await Promise.all(
        mutualLikes.map(async (userId) => {
          const [user] = await db
            .select({
              id: users.id,
              displayName: users.displayName,
              name: users.name,
              email: users.email,
              gender: users.gender,
              intro: users.intro,
              height: users.height,
              weight: users.weight,
              age: users.age,
              image: users.image,
            })
            .from(users)
            .where(eq(users.id, userId))
            .execute();
          return user as UserShow;
        }),
      );
      return NextResponse.json({ pairUsers }, { status: 200 });
    } else {
      const pairUsers: UserShow[] = [];
      return NextResponse.json({ pairUsers }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching pair users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
