import { eq, asc } from "drizzle-orm";
import Pusher from "pusher";

import { db } from "@/db";
import { messages as messagesTable } from "@/db/schema";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";
import type { Message } from "@/lib/types/db";

import { getChatByChatId } from "./chat";

export const triggerMessagePusher = async (chatId: string) => {
  "use server";
  if (!(await getChatByChatId(chatId))) return;
  const pusher = new Pusher({
    appId: privateEnv.PUSHER_ID,
    key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
    secret: privateEnv.PUSHER_SECRET,
    cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
  });
  await pusher.trigger(`private-message-${chatId}`, "message:update", {
    control: "fetch",
  });
};

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  if (!(await getChatByChatId(chatId))) return [];
  const messages: Message[] = await db
    .select({
      id: messagesTable.id,
      content: messagesTable.content,
      senderId: messagesTable.senderId,
      chatId: messagesTable.chatId,
      createdAt: messagesTable.createdAt,
    })
    .from(messagesTable)
    .where(eq(messagesTable.chatId, chatId))
    .orderBy(asc(messagesTable.createdAt));
  return messages;
};

export const sendMessage = async (
  message: Pick<Message, "senderId" | "chatId" | "content">,
): Promise<void> => {
  "use server";
  await db.insert(messagesTable).values(message).onConflictDoNothing();
  await triggerMessagePusher(message.chatId);
};
