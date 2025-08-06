import { NextResponse, type NextRequest } from "next/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { userLikesTable } from "@/db/schema";

const ratingRequestSchema = z.object({
  userId: z.string().min(1),
});

type ratingRequest = z.infer<typeof ratingRequestSchema>;

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.nextUrl).searchParams;
  const data = {
    userId: searchParams.get("userId"),
  };

  try {
    ratingRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { userId } = data as ratingRequest;

  try {
    const Ratings = await db
      .select({ rating: userLikesTable.rating })
      .from(userLikesTable)
      .where(eq(userLikesTable.likedId, userId))
      .execute();

    const ratings = Ratings.map((item) => item.rating);
    const filteredRatings = ratings.filter((rating) => rating !== null);

    if (filteredRatings.length === 0) {
      return NextResponse.json({ averageRating: null }, { status: 200 });
    }

    let sum = 0;
    filteredRatings.forEach(function (item) {
      if (item === null) {
        return;
      }
      sum += item;
    });
    const averageRating = sum / filteredRatings.length;

    return NextResponse.json({ averageRating }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
