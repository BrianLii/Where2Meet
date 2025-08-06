import { eq } from "drizzle-orm";

import { db } from "@/db";
import { eventRepliesTable, users } from "@/db/schema";

export type Reply = {
  id: number;
  userId: string;
  content: string;
  userName: string | null;
};

export const getReplies = async (eventId: number): Promise<Reply[]> => {
  const replies: Reply[] = await db
    .select({
      id: eventRepliesTable.id,
      userId: eventRepliesTable.userId,
      content: eventRepliesTable.content,
      userName: users.displayName,
    })
    .from(eventRepliesTable)
    .where(eq(eventRepliesTable.eventId, eventId))
    .orderBy(eventRepliesTable.id)
    .innerJoin(users, eq(users.id, eventRepliesTable.userId));

  return replies;
};

export const createReply = async (
  eventId: number,
  userId: string,
  content: string,
) => {
  await db
    .insert(eventRepliesTable)
    .values({
      userId,
      eventId,
      content,
    })
    .returning();
};
