import { NextResponse, type NextRequest } from "next/server";

import { auth } from "auth";

import { getChatMessages } from "@/app/actions/message";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { chatId: string };
  },
) {
  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { messages: await getChatMessages(params.chatId) },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
