import { eq, and } from "drizzle-orm";

import { getUser } from "@/app/actions/user";
import { db } from "@/db";
import { chats as chatsTable } from "@/db/schema";
import type { Chat } from "@/lib/types/db";

export const getChatByChatId = async (chatId: string): Promise<Chat | null> => {
  "use server";
  const [chat] = await db
    .select({
      id: chatsTable.id,
      userId1: chatsTable.userId1,
      userId2: chatsTable.userId2,
    })
    .from(chatsTable)
    .where(eq(chatsTable.id, chatId));
  return chat ? chat : null;
};

export const getChatByUserId = async (
  userId1: string,
  userId2: string,
): Promise<Chat | null> => {
  "use server";
  if (!getUser(userId1) || !getUser(userId2)) return null;

  if (userId1 > userId2) {
    [userId1, userId2] = [userId2, userId1];
  }
  const [chat] = await db
    .select({
      id: chatsTable.id,
      userId1: chatsTable.userId1,
      userId2: chatsTable.userId2,
    })
    .from(chatsTable)
    .where(
      and(eq(chatsTable.userId1, userId1), eq(chatsTable.userId2, userId2)),
    );
  return chat ? chat : null;
};

export const createChat = async (
  userId1: string,
  userId2: string,
): Promise<Chat | null> => {
  "use server";
  if (!getUser(userId1) || !getUser(userId2)) return null;
  if (userId1 > userId2) {
    [userId1, userId2] = [userId2, userId1];
  }

  const [newChat] = await db
    .insert(chatsTable)
    .values({ userId1, userId2 })
    .returning({
      id: chatsTable.id,
      userId1: chatsTable.userId1,
      userId2: chatsTable.userId2,
    })
    .onConflictDoNothing();
  return newChat ?? null;
};

export const deleteChat = async (chatId: string): Promise<void> => {
  "use server";
  await db.delete(chatsTable).where(eq(chatsTable.id, chatId)).returning();
};
