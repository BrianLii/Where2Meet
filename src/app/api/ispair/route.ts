import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { userLikesTable } from "@/db/schema";

const isPairRequestSchema = z.object({
  userId: z.string().min(1),
  otherId: z.string().min(1),
});
type IsPairRequest = z.infer<typeof isPairRequestSchema>;

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.nextUrl).searchParams;
  const data = {
    userId: searchParams.get("userId"),
    otherId: searchParams.get("otherId"),
  };

  try {
    isPairRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { userId, otherId } = data as IsPairRequest;

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

    const isPair = mutualLikes.includes(otherId);
    const Rating = isPair
      ? await db
          .select({ rating: userLikesTable.rating })
          .from(userLikesTable)
          .where(
            and(
              eq(userLikesTable.likerId, userId),
              eq(userLikesTable.likedId, otherId),
            ),
          )
          .limit(1)
          .execute()
      : null;
    const rating = Rating?.[0]?.rating ?? null;

    return NextResponse.json({ isPair, rating }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
