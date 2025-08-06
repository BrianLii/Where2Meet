import { eq, and } from "drizzle-orm";

import { db } from "@/db";
import { participationsTable } from "@/db/schema";

export const deleteParticipation = async (userId: string, eventId: number) => {
  "use server";
  await db
    .delete(participationsTable)
    .where(
      and(
        eq(participationsTable.userId, userId),
        eq(participationsTable.eventId, eventId),
      ),
    );
};

export const createParticipation = async (userId: string, eventId: number) => {
  "use server";
  const [newData] = await db
    .insert(participationsTable)
    .values({
      userId,
      eventId,
    })
    .returning();
  console.log(`[createParticipation] newData.id=${newData.id}`);
};
