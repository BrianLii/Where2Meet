import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { userLikesTable } from "@/db/schema";

const isLikeRequestSchema = z.object({
  likerId: z.string().min(1),
  likedId: z.string().min(1),
});
type IsLikeRequest = z.infer<typeof isLikeRequestSchema>;

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.nextUrl).searchParams;
  const data = {
    likerId: searchParams.get("likerId"),
    likedId: searchParams.get("likedId"),
  };

  try {
    isLikeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { likerId, likedId } = data as IsLikeRequest;

  try {
    const isLike = await db
      .select({ id: userLikesTable.id })
      .from(userLikesTable)
      .where(
        and(
          eq(userLikesTable.likerId, likerId),
          eq(userLikesTable.likedId, likedId),
        ),
      )
      .execute();

    return NextResponse.json({ isLike: isLike.length > 0 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
