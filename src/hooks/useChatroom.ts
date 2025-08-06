import { useCallback, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

import { pusherClient } from "@/lib/pusher/client";
import type { Message } from "@/lib/types/db";

type PusherPayload = {
  control: string;
  messages: Message[];
  pinnedMessage: string;
};

export const useChatroom = () => {
  const paramChatId = useParams().chatId;
  const chatId = Array.isArray(paramChatId) ? paramChatId[0] : paramChatId;
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  const fetchMessages = useCallback(async () => {
    const res = await fetch(`/api/messages/${chatId}`);
    if (!res.ok) return;
    setMessages((await res.json()).messages);
  }, [chatId, setMessages]);

  useEffect(() => {
    if (!chatId) return;
    const channelName = `private-message-${chatId}`;
    const channel = pusherClient.subscribe(channelName);
    channel.bind("message:update", async ({ control }: PusherPayload) => {
      if (control === "fetch") {
        await fetchMessages();
      }
    });
    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [chatId, router, fetchMessages]);

  useEffect(() => {
    if (!chatId) return;
    fetchMessages();
  }, [chatId, fetchMessages]);

  return {
    chatId,
    userId,
    messages,
  };
};
