import { redirect } from "next/navigation";

import { auth } from "auth";

import { getChatByChatId } from "@/app/actions/chat";
import { sendMessage } from "@/app/actions/message";
import { getUser } from "@/app/actions/user";
import { publicEnv } from "@/lib/env/public";
import type { UserMessage } from "@/lib/types/generic";

import Input from "./components/Input";
import Messages from "./components/Messages";

async function ChatroomPage({ params }: { params: { chatId: string } }) {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;
  const chatId = params.chatId;
  const chat = await getChatByChatId(chatId);
  if (!chat || (userId !== chat.userId1 && userId !== chat.userId2)) {
    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chats`);
  }

  const anotherUserId = userId === chat.userId1 ? chat.userId2 : chat.userId1;
  const anotherUser = await getUser(anotherUserId);
  if (!anotherUser) {
    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chats`);
  }

  const sendMessageWrapper = async (message: UserMessage): Promise<void> => {
    "use server";
    await sendMessage({
      senderId: userId,
      chatId,
      ...message,
    });
  };
  return (
    <div className="flex h-full w-full flex-col">
      <Messages anotherUsername={anotherUser.displayName || ""} />
      <Input sendMessage={sendMessageWrapper} />
    </div>
  );
}

export default ChatroomPage;
