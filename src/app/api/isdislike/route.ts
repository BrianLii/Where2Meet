import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { userDislikesTable } from "@/db/schema";

const isDislikeRequestSchema = z.object({
  dislikerId: z.string().min(1),
  dislikedId: z.string().min(1),
});
type IsDislikeRequest = z.infer<typeof isDislikeRequestSchema>;

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.nextUrl).searchParams;
  const data = {
    dislikerId: searchParams.get("dislikerId"),
    dislikedId: searchParams.get("dislikedId"),
  };

  try {
    isDislikeRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { dislikerId, dislikedId } = data as IsDislikeRequest;

  try {
    const isDislike = await db
      .select({ id: userDislikesTable.id })
      .from(userDislikesTable)
      .where(
        and(
          eq(userDislikesTable.dislikerId, dislikerId),
          eq(userDislikesTable.dislikedId, dislikedId),
        ),
      )
      .execute();

    return NextResponse.json(
      { isDisike: isDislike.length > 0 },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
