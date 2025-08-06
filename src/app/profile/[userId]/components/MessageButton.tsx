"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { Chat } from "@/lib/types/db";

function MessageButton({
  currentUserId,
  viewingUserId,
  createChat,
  getChatByUserId,
}: {
  currentUserId: string;
  viewingUserId: string;
  createChat: (userId1: string, userId2: string) => Promise<Chat | null>;
  getChatByUserId: (userId1: string, userId2: string) => Promise<Chat | null>;
}) {
  const router = useRouter();

  const messageButtonAction = async () => {
    await createChat(currentUserId, viewingUserId);
    const chat = await getChatByUserId(currentUserId, viewingUserId);
    if (!chat) return;
    console.log(chat);

    router.push(`/chats/${chat.id}`);
  };
  return (
    <Button variant={"outline"} onClick={messageButtonAction}>
      Message
    </Button>
  );
}
export default MessageButton;
