"use client";

import React, { useEffect, useRef } from "react";

import { useChatroom } from "@/hooks/useChatroom";

export default function Messages({
  anotherUsername,
}: {
  anotherUsername: string;
}) {
  const { messages, userId } = useChatroom();
  const historyRef = useRef<HTMLInputElement>(null);
  const scrollToElement = () => {
    const { current } = historyRef;
    if (current) {
      current.scrollTo({ behavior: "smooth", top: current.scrollHeight });
    }
  };

  useEffect(scrollToElement, [messages]);
  return (
    <>
      <div className="sticky top-0 flex h-16 items-center break-all bg-zinc-100 px-2">
        您與 {anotherUsername} 的聊天室
      </div>
      <div
        className="h-full w-full overflow-y-auto break-all px-4"
        ref={historyRef}
      >
        {messages.map((message) => {
          return (
            <div className="my-2 w-full" key={`message-${message.createdAt}`}>
              {message.senderId == userId ? (
                <div className="flex justify-end gap-1">
                  <div className="w-fit max-w-3xl rounded-lg bg-blue-600 p-2 text-slate-100 ">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className="flex justify-start gap-1">
                  <div className="w-fit max-w-3xl rounded-lg bg-gray-600 p-2 text-slate-100">
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
