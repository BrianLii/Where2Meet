import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { users, userDislikesTable } from "@/db/schema";

const getUserDislikesRequestSchema = z.object({
  userId: z.string().min(1),
});

type GetUserDislikesRequest = z.infer<typeof getUserDislikesRequestSchema>;

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.nextUrl).searchParams;
  const data = {
    userId: searchParams.get("userId"),
  };

  try {
    getUserDislikesRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId } = data as GetUserDislikesRequest;

  try {
    const dislikeUsers = await db
      .select({
        id: userDislikesTable.dislikedId,
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
      .from(userDislikesTable)
      .innerJoin(users, eq(users.id, userDislikesTable.dislikedId))
      .where(eq(userDislikesTable.dislikerId, userId))
      .execute();

    return NextResponse.json({ dislikeUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

const AddRequestSchema = z.object({
  dislikerId: z.string().min(1),
  dislikedId: z.string().min(1),
});

type AddLikeRequest = z.infer<typeof AddRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    AddRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { dislikerId, dislikedId } = data as AddLikeRequest;

  try {
    await db
      .insert(userDislikesTable)
      .values({
        dislikerId,
        dislikedId,
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
  dislikerId: z.string().min(1),
  dislikedId: z.string().min(1),
});
type RemoveLikeRequest = z.infer<typeof RemoveRequestSchema>;

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    RemoveRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { dislikerId, dislikedId } = data as RemoveLikeRequest;

  try {
    await db
      .delete(userDislikesTable)
      .where(
        and(
          eq(userDislikesTable.dislikerId, dislikerId),
          eq(userDislikesTable.dislikedId, dislikedId),
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
