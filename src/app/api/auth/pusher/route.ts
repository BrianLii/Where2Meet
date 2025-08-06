import { NextResponse, type NextRequest } from "next/server";

import { auth } from "auth";

import { getChatByChatId } from "@/app/actions/chat";
import { pusherServer } from "@/lib/pusher/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const data = await request.formData();
    const socketId = data.get("socket_id") as string;
    const channel = data.get("channel_name") as string;
    if (channel.startsWith("private-message-")) {
      const chatId = channel.slice("private-message-".length);
      const chats = await getChatByChatId(chatId);
      if (!chats || (chats.userId1 !== userId && chats.userId2 !== userId)) {
        return NextResponse.json(
          { error: "Invalid channel name" },
          { status: 400 },
        );
      }
      const authResponse = pusherServer.authorizeChannel(socketId, channel);
      return NextResponse.json(authResponse);
    } else {
      return NextResponse.json(
        { error: "Invalid channel name" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
