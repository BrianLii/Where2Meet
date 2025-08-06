import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { getReplies, createReply } from "@/app/actions/reply";

const RequestSchema = z.object({
  eventId: z.number(),
});

type GetRepliesRequest = z.infer<typeof RequestSchema>;

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.nextUrl).searchParams;
  const data = {
    eventId: parseInt(searchParams.get("eventId") as string),
  };
  try {
    RequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { eventId } = data as GetRepliesRequest;

  try {
    return NextResponse.json(
      { replies: await getReplies(eventId) },
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

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    await createReply(data.eventId, data.userId, data.content);
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
