import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { users, userLikesTable } from "@/db/schema";

const RequestSchema = z.object({
  userId: z.string().min(1),
});

type GetUserLikesRequest = z.infer<typeof RequestSchema>;

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.nextUrl).searchParams;
  const data = {
    userId: searchParams.get("userId"),
  };

  try {
    RequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId } = data as GetUserLikesRequest;

  try {
    const likeUsers = await db
      .select({
        id: userLikesTable.likedId,
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
      .from(userLikesTable)
      .innerJoin(users, eq(users.id, userLikesTable.likedId))
      .where(eq(userLikesTable.likerId, userId))
      .execute();

    return NextResponse.json({ likeUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

const AddRequestSchema = z.object({
  likerId: z.string().min(1),
  likedId: z.string().min(1),
});

type AddLikeRequest = z.infer<typeof AddRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    AddRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { likerId, likedId } = data as AddLikeRequest;

  try {
    await db
      .insert(userLikesTable)
      .values({
        likerId,
        likedId,
      })
      .onConflictDoNothing()
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true }, { status: 200 });
}

const RemoveRequestSchema = z.object({
  likerId: z.string().min(1),
  likedId: z.string().min(1),
});
type RemoveLikeRequest = z.infer<typeof RemoveRequestSchema>;

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    RemoveRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { likerId, likedId } = data as RemoveLikeRequest;

  try {
    await db
      .delete(userLikesTable)
      .where(
        and(
          eq(userLikesTable.likerId, likerId),
          eq(userLikesTable.likedId, likedId),
        ),
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true }, { status: 200 });
}

const PatchRequestSchema = z.object({
  likerId: z.string().min(1),
  likedId: z.string().min(1),
  rating: z.number().min(0).max(5),
});

type PatchRatingRequest = z.infer<typeof PatchRequestSchema>;

export async function PATCH(request: NextRequest) {
  const data = await request.json();

  try {
    PatchRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { likerId, likedId, rating } = data as PatchRatingRequest;

  try {
    await db
      .update(userLikesTable)
      .set({ rating })
      .where(
        and(
          eq(userLikesTable.likerId, likerId),
          eq(userLikesTable.likedId, likedId),
        ),
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
