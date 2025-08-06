"use client";

import { useEffect, useState } from "react";

import { Divider } from "@mui/material";

import type { Reply } from "@/app/actions/reply";

import ReplyInput from "./ReplyInput";

type EventChatroomProps = {
  eventId: number;
  userId: string;
  eventTitle: string;
  joined: boolean;
};

export default function EventChatroom({
  eventId,
  userId,
  eventTitle,
  joined,
}: EventChatroomProps) {
  const [replies, setReplies] = useState<Reply[]>([]);

  const createReply = async (
    eventId: number,
    userId: string,
    content: string,
  ) => {
    const postResponse = await fetch("/api/reply", {
      method: "POST",
      body: JSON.stringify({
        eventId: eventId,
        userId: userId,
        content: content,
      }),
    });
    if (!postResponse.ok) {
      throw new Error("Failed to post replies");
    }
    const response = await fetch(`/api/reply?eventId=${eventId}`);
    if (!response.ok) {
      throw new Error("Failed to get replies");
    }
    const data = await response.json();
    setReplies(data.replies);
    return;
  };

  useEffect(() => {
    const getReplies = async () => {
      const response = await fetch(`/api/reply?eventId=${eventId}`);
      if (!response.ok) {
        throw new Error("Failed to get replies");
      }
      const data = await response.json();
      setReplies(data.replies);
    };
    getReplies();
  }, [eventId]);

  return (
    <>
      <Divider />
      <div className="overflow-auto p-3">
        {replies.map((reply: Reply) => {
          return (
            <div key={reply.id} className="flex">
              <p className="font-bold">
                {reply.userName} :
                <span className="ml-2 font-normal text-gray-400">
                  {reply.content}
                </span>
              </p>
            </div>
          );
        })}
      </div>
      <ReplyInput
        eventId={eventId}
        userId={userId}
        eventTitle={eventTitle}
        createReply={createReply}
        joined={joined}
      />
    </>
  );
}
